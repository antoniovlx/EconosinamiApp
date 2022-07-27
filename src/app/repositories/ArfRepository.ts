import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Arf } from "src/entities/Arf";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class ArfRepository extends MainRepository {
    getAllArf(): Observable<Arf[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Arf);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateArf(arf: Arf) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Arf);
            const item = repository.create(arf);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    gellAllByFdr(idFdr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Arf);
            return repository.createQueryBuilder("arf")
                .innerJoinAndSelect("arf.idFdr", "fdr")
                .innerJoinAndSelect("arf.idDre", "dre")
                .where("fdr.idFdr = :idFdr", { idFdr })
                .orderBy('dre.dre', 'ASC')
                .getMany().then(list => subscriber.next(list));
        };

        return this.runQuery(queryFunction);
    }

    deleteArfByDre(idDre: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM ARF " +
                "WHERE IdDRE = " + idDre).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
    deleteArfByFdr(idFdr: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM ARF " +
                "WHERE IdFDR = " + idFdr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

}