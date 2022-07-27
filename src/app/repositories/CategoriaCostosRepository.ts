import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CategoriaCostos } from "src/entities/CategoriaCostos";
import { Connection, getManager, Repository } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class CategoriaCostosRepository extends MainRepository {
    getAllCategoriaCostos(): Observable<CategoriaCostos[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(CategoriaCostos);
            return repository.find().then((list: CategoriaCostos[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveCategoriaCostos(categoria: CategoriaCostos) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(CategoriaCostos);
            const item = repo.create(categoria);
            repo.save(item).then((categoria) => subscriber.next(categoria));
        };
        return this.runQuery(queryFunction);
    }

    deleteCategoriaCostos(categoria: CategoriaCostos) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(CategoriaCostos);
            const item = repo.create(categoria);
            repo.remove(item).then((categoria) => subscriber.next(categoria));
        };
        return this.runQuery(queryFunction);
    }



}