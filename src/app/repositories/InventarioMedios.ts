import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { InventarioMedios } from "src/entities/InventarioMedios";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class InventarioMediosRepository extends MainRepository {

    getAllInventarioMedios(idLr: number): Observable<InventarioMedios[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(InventarioMedios);
            return repository.createQueryBuilder("inventarioMedios")
                .innerJoin("inventarioMedios.idLr", "lr")
                .innerJoinAndSelect("inventarioMedios.idMedio", "medios")
                .where("inventarioMedios.idLr = :idLr", { idLr })
                .andWhere('inventarioMedios.idLr = lr.idLr')
                .andWhere('inventarioMedios.idMedio = medios.idMedio')
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateInventarioMedios(inventario: InventarioMedios) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(InventarioMedios);
            const item = repository.create(inventario);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteInventarioMedios(inventario: InventarioMedios) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(InventarioMedios);
            const item = repository.create(inventario);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getByMedio(idLr: number, idMedio: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(InventarioMedios);
            return repository.createQueryBuilder("inventarioMedios")
                .innerJoin("inventarioMedios.idLr", "lr")
                .innerJoinAndSelect("inventarioMedios.idMedio", "medios")
                .where("inventarioMedios.idLr = :idLr", { idLr })
                .andWhere('inventarioMedios.idMedio = :idMedio', { idMedio })
                .andWhere('inventarioMedios.idLr = lr.idLr')
                .andWhere('inventarioMedios.idMedio = medios.idMedio')
                .getOne().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getInventarioByOpcionLr(idOpcion: number, idLr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(InventarioMedios);
            return repository.createQueryBuilder("inventarioMedios")
                .leftJoinAndSelect("inventarioMedios.idMedio", "medio")
                .leftJoinAndSelect("inventarioMedios.idLr", "lr")
                .leftJoinAndSelect("medio.idDre", "dre")
                .leftJoin("medio.opciones", "mediosOpciones")
                .where("mediosOpciones.idOpcion = :idOpcion", { idOpcion })
                .andWhere("dre.idDre > 0")
                .andWhere("lr.idLr = :idLr", { idLr })
                .andWhere("inventarioMedios.tiempoLlegada > 0")
                .orderBy('inventarioMedios.tiempoLlegada')
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getInventarioByOpcionLrDatosEjecucion(idOpcion: number, idLr: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "select IM.TiempoLlegada as tiempoLllegada, " +
                "IM.Rendimiento as rendimiento, " +
                "IM.CostoUnitarioPorMision as costoUnitarioPorMision, " +
                "IM.CostoRecarga as costoRecarga, " +
                "IM.TiempoRecarga as tiempoRecarga, " +
                "IM.MaximoDescargas as maximoDescargas, " +
                "  IA.Intensidad as intensidad, " +
                "  M.IdMedio as idMedio, M.NecesitaAgua as necesitaAgua, M.TipoAeronave as tipoAeronave " +
                "from InventarioMedios IM, IntensidadActivacion IA, Medios M " +
                "where IA.IdOpcion = " + idOpcion +
                "  and IA.IdLR = IM.IdLR" +
                "  and IA.IdMedio = IM.IdMedio" +
                "  and IA.Intensidad > 0" +
                "  and IM.IdLR = " + idLr +
                "  and IM.TipoUnidad < 4" +
                "  and IM.TiempoLlegada > 0 and IM.TiempoLlegada <= 1440" +
                "  and M.IdMedio = IM.IdMedio").then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    deleteByMedio() {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM InventarioMedios " +
                "WHERE IdMedio IN (SELECT IdMedio FROM Medios WHERE CalcularAutoInventario = 'True')").then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteByLr(idLr: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM InventarioMedios " +
                "WHERE IdLr = " + idLr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }


    updateInventario() {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM InventarioMedios " +
                "WHERE IdMedio IN (SELECT IdMedio FROM Medios WHERE CalcularAutoInventario = 'True')").then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

}