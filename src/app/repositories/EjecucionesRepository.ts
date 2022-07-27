import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { Cphlr } from "src/entities/Cphlr";
import { Ejecucion } from "src/entities/Ejecucion";
import { Ejecuciones } from "src/entities/Ejecuciones";
import { getManager, Repository } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class EjecucionesRepository extends MainRepository {

    getAllEjecuciones(): Observable<Ejecuciones[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Ejecuciones);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getAllByParameters(idZamif: number, idGdcf: number, idOpcion: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Ejecuciones);
            return repository.createQueryBuilder("ejecuciones")
                .where("ejecuciones.idZamif = :idZamif", { idZamif })
                .andWhere("ejecuciones.idGdcf = :idGdcf", { idGdcf })
                .andWhere("ejecuciones.idOpcion = :idOpcion", { idOpcion })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getEjecucionById(idEjecucion: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Ejecucion);
            return repository.createQueryBuilder("ejecucion")
                .leftJoinAndSelect("ejecucion.idLr", "lr")
                .where("ejecucion.idEjecucion = :idEjecucion", { idEjecucion })
                .orderBy("ejecucion.intensidad", "ASC")
                .addOrderBy("ejecucion.idLr", "ASC")
                .addOrderBy("ejecucion.percentil", "ASC")
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }


    getEjecucionWhereParemeters(idEjecucion: number, intensidad: number, sumParam: string, whereSize: string) {
        let queryFunction = (connection, subscriber) => {
            let consulta = "select sum(" + sumParam + ") AS ASum" +
                " from Ejecucion where IdEjecucion = " + idEjecucion +
                " and Intensidad = " + (intensidad + 1) +
                " and " + whereSize;

            return getManager().query(consulta);
        };
        return this.runQuery(queryFunction);
    }

    getResumenFuegosAnualesEjecucion(idEjecucion: number, idLr: number) {
        let queryFunction = (connection, subscriber) => {
            let consulta = "select IdLR, sum(Frecuencia) AS SFreq, Sum(Area * Frecuencia) AS SHas, Sum(Frecuencia * (CPH + Costo)) AS Supp, Sum(Frecuencia * CNVR) AS SNVC" +
                " from Ejecucion where IdEjecucion = " + idEjecucion +
                " and IdLR =  " + idLr;

            return getManager().query(consulta);
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateEjecuciones(ejecucion: Ejecuciones) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Ejecuciones);
            //let res = await getManager().query("select MAX(IdEjecucion) as max from Ejecuciones");
            //ejecucion.idEjecucion = res[0].max === null ? 1 : (Number.parseInt(res[0].max) + 1);
            const item = repository.create(ejecucion);
            repository.save(item).then((ejecuciones) => subscriber.next(ejecuciones));

        };
        return this.runQuery(queryFunction);
    }
    getMaxIdEjecucion() {
        let queryFunction = (connection, subscriber) => {
            return getManager().query("select MAX(IdEjecucion) as max from Ejecuciones")
            .then((res) => subscriber.next(res));
        };
        return this.runQuery(queryFunction);
    }

    deleteEjecuciones(ejecucion: Ejecuciones) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Ejecuciones);
            const item = repository.create(ejecucion);
            return repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteEjecucion(idEjecucion: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Ejecuciones);
            return repository.createQueryBuilder()
                .delete()
                .from(Ejecucion)
                .where("idEjecucion = :idEjecucion", { idEjecucion })
                .execute().then(() => subscriber.next(true));

        };
        return this.runQuery(queryFunction);
    }

}