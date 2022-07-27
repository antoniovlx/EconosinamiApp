import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cphlr } from "src/entities/Cphlr";
import { DatosEjecucion } from "src/entities/DatosEjecucion";
import { Ejecucion } from "src/entities/Ejecucion";
import { getManager, Repository } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class DatosEjecucionRepository extends MainRepository {

    getAllDatosEjecucion(idOpcion: number, idLr: number, intensidad: number): Observable<DatosEjecucion[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(DatosEjecucion);
            return repository.createQueryBuilder("datosEjecucion")
                .leftJoin("datosEjecucion.idOpcion", "opcion")
                .leftJoin("datosEjecucion.idLr", "lr")
                .where("opcion.idOpcion = :idOpcion", { idOpcion })
                .andWhere("lr.idLr = :idLr", { idLr })
                .andWhere("datosEjecucion.intensidad <= :intensidad", { intensidad })
                .orderBy("datosEjecucion.minuto")
                .addOrderBy('datosEjecucion.estado').getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getFirstGround(idOpcion: number, idLr: number, intensidad: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(DatosEjecucion);
            const query = repository
                .createQueryBuilder("datosEjecucion")
                .select("MIN(datosEjecucion.minuto)", "FirstGround")
                .leftJoin("datosEjecucion.idOpcion", "opcion")
                .leftJoin("datosEjecucion.idLr", "lr")
                .where("opcion.idOpcion = :idOpcion", { idOpcion })
                .andWhere("lr.idLr = :idLr", { idLr })
                .andWhere("datosEjecucion.intensidad <= :intensidad", { intensidad })
                .andWhere("datosEjecucion.estado = 10")
                .orWhere("datosEjecucion.estado = 20")
                .orWhere("datosEjecucion.estado = 40");

            return query.getRawOne().then(result => subscriber.next(result.FirstGround));
        };
        return this.runQuery(queryFunction);
    }

    getFirstWater(idOpcion: number, idLr: number, intensidad: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(DatosEjecucion);
            const query = repository
            .createQueryBuilder("datosEjecucion")
            .leftJoin("datosEjecucion.idOpcion", "opcion")
            .leftJoin("datosEjecucion.idLr", "lr")
            .where("opcion.idOpcion = :idOpcion", { idOpcion })
            .andWhere("lr.idLr = :idLr", { idLr })
            .andWhere("datosEjecucion.intensidad <= :intensidad", { intensidad })
            .andWhere("datosEjecucion.estado = 10");

            query.select("MIN(datosEjecucion.minuto)", "FirstWater");
            return query.getRawOne().then(result => subscriber.next(result.FirstWater));
        };
        return this.runQuery(queryFunction);
    };

    saveDatosEjecucion(datos: DatosEjecucion){
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(DatosEjecucion);
            const item = repository.create(datos);
            return repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteDatosEjecucion(idOpcion: number, idZamif: number, idLr: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM DatosEjecucion " +
                "WHERE IdOpcion = " + idOpcion + " AND " +
                "IdZamif = " + idZamif + " AND " +
                "IdLr = " + idLr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

}