import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Dre } from "src/entities/Dre";
import { Medios } from "src/entities/Medios";
import { Opciones } from "src/entities/Opciones";
import { Presupuestos } from "src/entities/Presupuestos";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class MediosRepository extends MainRepository {
    getAllMedios(): Observable<Medios[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            return repository.find({ relations: ["idGrupoMedios", "idCategoriaMedios", "idDre", "idBase", "presupuestos", "opciones"] })
                .then((list: Medios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateMedios(medio: Medios) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            const item = repository.create(medio);
            repository.save(item).then((medio) => subscriber.next(medio));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdatePresupuestos(presupuesto: Presupuestos) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Presupuestos);
            const item = repository.create(presupuesto);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteMedios(medio: Medios) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            const item = repository.create(medio);
            repository.remove(item).then((medio) => subscriber.next(medio));
        };
        return this.runQuery(queryFunction);
    }

    getMediosWhereCalcularInventario() {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            return repository.createQueryBuilder("medios")
                .leftJoinAndSelect("medios.idGrupoMedios", "idGrupoMedios")
                .leftJoinAndSelect("medios.idBase", "base")
                .where("medios.calcularAutoInventario = 'True'")
                .orderBy("medios.descripcion")
                .getMany().then((list: Medios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getMediosIntensidadActivacion(idOpcion: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            return repository.createQueryBuilder("medios")
                .leftJoin("medios.opciones", "mediosOpciones")
                .where("mediosOpciones.idOpcion = :idOpcion", { idOpcion })
                .andWhere("medios.tipoUnidad < 4")
                .andWhere("medios.intensidadActivacion > 0")
                .getMany().then((list: Medios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }



    countMediosOpcionCategoria(idOpcion: number, idCategoria: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            return repository.createQueryBuilder("medios")
                .select("COUNT(medios.idMedio)", "count")
                .leftJoin("medios.opciones", "mediosOpciones")
                .leftJoin("medios.idCategoriaMedios", "categoria")
                .where("mediosOpciones.idOpcion = :idOpcion", { idOpcion })
                .andWhere("categoria.idCategoriaMedios = :idCategoria", { idCategoria })
                .getRawOne().then((list: Medios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getByLrs(lrs: number[]) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            return repository.createQueryBuilder("medios")
                .innerJoin("medios.inventarioMedios", "inventarioMedios")
                .innerJoin("inventarioMedios.idLr", "lr")
                .where("lr.idLr IN (:...ids)", {
                    ids: lrs,
                })
                .getMany().then((list: Medios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getPresupuestosMedios() {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            return getManager().query("SELECT Presupuesto as presupuesto, IdMedio as idMedio FROM VistaPresupuestos")
                .then((list: Medios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateMediosOpciones(idMedio: number,  idOpcion: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "INSERT INTO MediosOpciones(IdMedio, IdOpcion) " +
                "VALUES(" + idMedio + ", " + idOpcion + ")").then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteMediosOpciones(idMedio: number,  idOpcion: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM MediosOpciones " +
                "WHERE idMedio = " + idMedio + " AND idOpcion = " + idOpcion).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }


    updateWhereVelocidadMenor0(cantidad: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Medios);
            return repository.createQueryBuilder()
                .update(Medios)
                .set({ velocidad: cantidad })
                .where("velocidad <= 0")
                .execute().then((list: Medios[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

}