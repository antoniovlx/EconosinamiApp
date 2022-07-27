import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bases } from "src/entities/Bases";
import { Cph } from "src/entities/Cph";
import { Connection, getManager, Repository } from "typeorm";
import { OrmService } from "../services/orm.service";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class CphRepository extends MainRepository {
    getCphByZamif(idZamif: number): Observable<Cph[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Cph);
            return repository.createQueryBuilder("cph")
                .leftJoinAndSelect('cph.idZamif', 'zamif')
                .where('zamif.idZamif = :zamif', { zamif: idZamif })
                .getMany().then((cph: Cph) => subscriber.next(cph));
        };
        return this.runQuery(queryFunction);
    }

    saveCph(cph: Cph) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Cph);
            const item = repo.create(cph);
            repo.save(item).then((cph) => subscriber.next(cph));
        };
        return this.runQuery(queryFunction);
    }

    deleteCphByZamif(idZamif:number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM Cph " +
                "WHERE IdZAMIF = " + idZamif).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }


}