import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IntensidadActivacion } from "src/entities/IntensidadActivacion";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class IntensidadActivacionRepository extends MainRepository {

    saveOrUpdateIntensidadActivacion(intensidad: IntensidadActivacion) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(IntensidadActivacion);
            const item = repository.create(intensidad);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteIntensidadActivacion(inventario: IntensidadActivacion) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(IntensidadActivacion);
            const item = repository.create(inventario);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getIntensidadActivacionByOpcionAndLr(idOpcion: number, idLr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(IntensidadActivacion);
            return repository.createQueryBuilder("intensidadActivacion")
                .leftJoinAndSelect("intensidadActivacion.idMedio", "medio")
                .leftJoinAndSelect("intensidadActivacion.idLr", "lr")
                .leftJoin("intensidadActivacion.idOpcion", "opcion")
                .where("opcion.idOpcion = :idOpcion", { idOpcion })
                .andWhere("lr.idLr = :idLr", { idLr })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }
    
    deleteByOpcionZamif(idOpcion: number, idZamif: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM IntensidadActivacion " +
                "WHERE IdOpcion = " + idOpcion + " AND IdLR IN (SELECT IdLR FROM LR WHERE IdZAMIF = " + idZamif + ")").then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteByOpcionLr(idOpcion: number, idLr: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM IntensidadActivacion " +
                "WHERE IdOpcion = " + idOpcion + " AND IdLR  = " + idLr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}