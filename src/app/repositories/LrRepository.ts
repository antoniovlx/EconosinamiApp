import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { Lr } from "src/entities/Lr";
import { getConnection, getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class LrRepository extends MainRepository {

    getAllLr(): Observable<Lr[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Lr);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateLr(lr: Lr) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Lr);
            const item = repository.create(lr);
            repository.save(item).then((lr: Lr) => subscriber.next(lr));
        };
        return this.runQuery(queryFunction);
    }

    deleteLr(lr: Lr) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Lr);
            const item = repository.create(lr);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteLrByZamif(idZamif: number) {
        /*let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM LR " +
                "WHERE IdZAMIF = " + idZamif).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);*/

        let queryFunction = (connection, subscriber) => {
            const repository = getConnection()
            .createQueryBuilder()
            .delete()
            .from(Lr)
            .where("idZamif = :id", { id: idZamif })
            .execute().then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);

    }


    getByZamif(idZamif: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Lr);
            return repository.createQueryBuilder("lr")
                .innerJoinAndSelect("lr.idZamif", "zamif")
                .leftJoinAndSelect("lr.distancias", "distancias")
                .leftJoinAndSelect("distancias.idBase", "base")
                .where("zamif.idZamif = :idZamif", { idZamif })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getLrAndDcflrsByZamif(idZamif: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Lr);
            return repository.createQueryBuilder("lr")
                .innerJoinAndSelect("lr.idZamif", "zamif")
                .leftJoinAndSelect("lr.dcflrs", "dcflrs")
                .where("zamif.idZamif = :idZamif", { idZamif })
                .andWhere("dcflrs.idLr = lr.idLr")
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getByGDfc(idGdcf: number, idZamif: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Lr);
            return repository.createQueryBuilder("lr")
                .innerJoin("lr.dcflrs", "dcflrs")
                .where("lr.idZamif = :idZamif", { idZamif })
                .andWhere("dcflrs.idGdcf = :idGdcf", { idGdcf })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getLrByCnvr(idCnvr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Lr);
            return repository.createQueryBuilder("lr")
                .leftJoin("lr.cnvrLrs", "cnvrLrs")
                .leftJoin("cnvrLrs.idGrupoCnvr", "grupoCnvr")
                .where("lr.idLr = cnvrLrs.idLr")
                .andWhere("grupoCnvr.idGrupoCnvr = :idCnvr", { idCnvr })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getLastIndex() {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Lr);
            return repository.createQueryBuilder("lr")
                .select("COUNT(lr.idLr)", "count")
                .getRawOne().then(count => subscriber.next(count));
        };
        return this.runQuery(queryFunction);
    }
}