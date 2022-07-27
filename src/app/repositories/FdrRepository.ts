import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Fdr } from "src/entities/Fdr";
import { Fdrlr } from "src/entities/Fdrlr";
import { Opciones } from "src/entities/Opciones";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class FdrRepository extends MainRepository {


    getAllFdr(): Observable<Fdr[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fdr);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateFdr(fdr: Fdr) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fdr);
            const item = repository.create(fdr);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }


    deleteFdrlr(fdr: Fdrlr) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fdrlr);
            const item = repository.create(fdr);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getAllFdrlr(): Observable<Fdrlr[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fdrlr);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateFdrlr(fdr: Fdrlr) {
        /*let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fdrlr);
            const item = repository.create(fdr);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);*/

        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "INSERT INTO FDRLR(IdOpcion, IdLR, IdFDR) " +
                "VALUES(" + fdr.idOpcion.idOpcion + ", " + fdr.idLr.idLr + ", " + fdr.idFdr.idFdr + ")").then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }


    deleteFdr(fdr: Fdr) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fdr);
            const item = repository.create(fdr);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getFdrlrByOpcion(idOpcion: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fdrlr);
            const item = repository.createQueryBuilder("fdrlr")
                .innerJoin("fdrlr.idOpcion", "opciones")
                .innerJoinAndSelect("fdrlr.idLr", "lr")
                .innerJoinAndSelect("fdrlr.idFdr", "fdr")
                .where("opciones.idOpcion = :idOpcion", { idOpcion })
                .andWhere('fdrlr.idOpcion = opciones.idOpcion')
                .andWhere('lr.idLr = fdrlr.idLr')
                .andWhere('fdr.idFdr = fdrlr.idFdr')
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getFdrlrByOpcionLr(idOpcion: number, idLr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fdrlr);
            const item = repository.createQueryBuilder("fdrlr")
                .innerJoin("fdrlr.idOpcion", "opciones")
                .innerJoin("fdrlr.idLr", "lr")
                .innerJoinAndSelect("fdrlr.idFdr", "fdr")
                .where("opciones.idOpcion = :idOpcion", { idOpcion })
                .andWhere('lr.idLr = :idLr', { idLr })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    deleteFdrlrByOpciones(opcion: Opciones) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM FDRLR " +
                "WHERE IdOpcion = " + opcion.idOpcion).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);

    }

}