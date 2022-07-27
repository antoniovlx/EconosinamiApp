import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bases } from "src/entities/Bases";
import { Cph } from "src/entities/Cph";
import { Distancias } from "src/entities/Distancias";
import { Dre } from "src/entities/Dre";
import { GruposDcf } from "src/entities/GruposDcf";
import { Connection, getManager, Repository } from "typeorm";
import { OrmService } from "../services/orm.service";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class DistanciasRepository extends MainRepository {
    getDistanciasByLr(idLr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Distancias);
            return repository.createQueryBuilder("distancias")
                .leftJoinAndSelect("distancias.idBase", "base")
                .leftJoinAndSelect("distancias.idLr", "lr")
                .where("lr.idLr = :idLr", { idLr })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveDistancias(idLr: number, idBase: number, kilometros: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "INSERT INTO Distancias (IdLR, IdBase, Kilometros) " +
                "VALUES(" + idLr + ", " + idBase + ", " + kilometros + ")").then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
    
    deleteDistanciasByLr(idLr: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM Distancias " +
                "WHERE IdLR = " + idLr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
      }
  

    deleteDistanciasByBase(idBase: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM Distancias " +
                "WHERE IdBase = " + idBase).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }


}