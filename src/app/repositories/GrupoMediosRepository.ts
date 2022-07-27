import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Dre } from "src/entities/Dre";
import { GrupoMedios } from "src/entities/GrupoMedios";
import { Medios } from "src/entities/Medios";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class GrupoMediosRepository extends MainRepository {

    getAllGrupoMedios(): Observable<GrupoMedios[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GrupoMedios);
            return repository.createQueryBuilder("grupo")
            .leftJoinAndSelect("grupo.idCategoriaMedios", "categoriaMedios")
            .leftJoinAndSelect("grupo.idDre", "dre")
            .leftJoinAndSelect("grupo.tipoAeronave", "tipoAeronave")
            .orderBy('grupo.grupoMedios', 'ASC')
            .getMany().then((list: Medios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateGrupoMedios(grupo: GrupoMedios) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoMedios);
            const item = repo.create(grupo);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteGrupoMedios(grupo: GrupoMedios) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoMedios);
            const item = repo.create(grupo);
            repo.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}