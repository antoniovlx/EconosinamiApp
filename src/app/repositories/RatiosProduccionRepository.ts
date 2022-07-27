import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { RatiosProduccion } from "src/entities/RatiosProduccion";
import { TipoAeronave } from "src/entities/TipoAeronave";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class RatiosProduccionRepository extends MainRepository {


    getAllRatiosProduccion(): Observable<RatiosProduccion[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(RatiosProduccion);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateRatiosProduccion(ratio: RatiosProduccion) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(RatiosProduccion);
            const item = repository.create(ratio);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteRatiosProduccion(ratio: RatiosProduccion) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(RatiosProduccion);
            const item = repository.create(ratio);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getRatiosByGrupoMedio(idGrupoMedios: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(RatiosProduccion);
            return repository.createQueryBuilder("ratios")
                .leftJoinAndSelect('ratios.idModeloCombustible', 'modelo')
                .leftJoinAndSelect("ratios.idGrupoMedios", "grupo")
                .where('grupo.idGrupoMedios = :idGrupoMedios', { idGrupoMedios })
                .orderBy('modelo.modeloCombustible', 'ASC')
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getRatiosByGrupoMedioAndModelo(idGrupoMedios: number, idModelo: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(RatiosProduccion);
            return repository.createQueryBuilder("ratios")
                .leftJoinAndSelect('ratios.idModeloCombustible', 'modelo')
                .leftJoinAndSelect("ratios.idGrupoMedios", "grupo")
                .where('grupo.idGrupoMedios = :idGrupoMedios', { idGrupoMedios })
                .andWhere('modelo.idModeloCombustible = :idModelo', { idModelo })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    deleteRatiosProduccionByGrupoMedio(idGrupoMedio: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM RatiosProduccion " +
                "WHERE IdGrupoMedios = " + idGrupoMedio).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
    }

}