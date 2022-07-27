import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CategoriaMedios } from "src/entities/CategoriaMedios";
import { Connection, getManager, Repository } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class CategoriaMediosRepository extends MainRepository {
    getAllCategoriaMedios(): Observable<CategoriaMedios[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(CategoriaMedios);
            return repository.createQueryBuilder("categoria")
                .orderBy('categoria.categoriaMedios', 'ASC')
                .getMany().then((list: CategoriaMedios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveCategoriaMedios(categoria: CategoriaMedios) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(CategoriaMedios);
            const item = repo.create(categoria);
            repo.save(item).then((categoria) => subscriber.next(categoria));
        };
        return this.runQuery(queryFunction);
    }

    deleteCategoriaMedios(categoria: CategoriaMedios) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(CategoriaMedios);
            const item = repo.create(categoria);
            repo.remove(item).then((categoria) => subscriber.next(categoria));
        };
        return this.runQuery(queryFunction);
    }


    getExistingMedios() {
        let queryFunction = (connection, subscriber) => {
            return getManager().query('SELECT IdCategoriaMedios as idCategoriaMedios, "(" || CategoriaMedios || ")" || " " || Descripcion ' +
                'AS codDesc FROM CategoriaMedios WHERE IdCategoriaMedios IN (SELECT distinct IdCategoriaMedios FROM Medios) ORDER BY CategoriaMedios').then((list: CategoriaMedios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getAllCompleto() {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(CategoriaMedios);
            return repository.createQueryBuilder("categoria")
                .leftJoinAndSelect('categoria.medios', 'medios')
                .leftJoinAndSelect('medios.opciones', 'opciones')
                .orderBy('categoria.categoriaMedios', 'ASC')
                .getMany().then((list: CategoriaMedios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

}