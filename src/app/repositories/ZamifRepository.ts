import { Connection, Repository } from "typeorm";
import { Observable } from "rxjs";
import { OrmService } from "../services/orm.service";
import { Zamif } from "src/entities/Zamif";
import { Injectable } from "@angular/core";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class ZamifRepository extends MainRepository {

    getAllZamif(): Observable<Zamif[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Zamif);
            return repository.find({ relations: ['lrs'] }).then(zamifList => subscriber.next(zamifList));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateZamif(zamif: Zamif) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Zamif);
            const item = repo.create(zamif);
            repo.save(item).then((zamif: Zamif) => subscriber.next(zamif));
        };
        return this.runQuery(queryFunction);
    }

    deleteZamif(zamif: Zamif) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Zamif);
            const item = repository.create(zamif);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getZamifById(idZamif: number){
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Zamif);
            return repository.createQueryBuilder("zamif")
            .leftJoinAndSelect('zamif.lrs', 'lrs')
            .where("zamif.idZamif = :idZamif", { idZamif })
            .getOne().then(zamifList => subscriber.next(zamifList));
        };
        return this.runQuery(queryFunction);
    }

    getZamifByDfc(gdfc: number){
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Zamif);
            return repository.createQueryBuilder("dcf")
            .leftJoinAndSelect('dcf.idGdcf', 'gdcf')
            .leftJoinAndSelect("dcf.idZamif", "zamif")
            .where('dcf.idGdcf = :id', { gdfc })
            .andWhere('dcf.idZamif = zamif.idZamif').then(zamifList => subscriber.next(zamifList));
        };
        return this.runQuery(queryFunction);
    }
}