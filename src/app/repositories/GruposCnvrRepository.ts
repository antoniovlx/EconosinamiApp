import { Connection, getManager, Repository } from "typeorm";
import { Observable } from "rxjs";
import { OrmService } from "../services/orm.service";
import { Zamif } from "src/entities/Zamif";
import { Injectable } from "@angular/core";
import { MainRepository } from "./MainRepository";
import { GrupoFustal } from "src/entities/GrupoFustal";
import { GrupoLatizal } from "src/entities/GrupoLatizal";
import { GrupoMontebravo } from "src/entities/GrupoMontebravo";
import { GrupoCnvr } from "src/entities/GrupoCnvr";
import { CnvrLr } from "src/entities/CnvrLr";
import { Cnvr } from "src/entities/Cnvr";

@Injectable({
    providedIn: 'root'
})
export class GruposCnvrRepository extends MainRepository {
    getAllGruposCnvr(): Observable<GrupoCnvr[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GrupoCnvr);
            return repository.find({ relations: ["idGrupoFustal", "idGrupoLatizal", "idGrupoMontebravo"] }).then(grupoList => subscriber.next(grupoList));
        };
        return this.runQuery(queryFunction);
    }

    getCnvrByGrupoCnvr(idGrupoCnvr: number, bloqueado?: boolean) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Cnvr);
            let consulta = repository.createQueryBuilder("cnvr")
                .innerJoinAndSelect("cnvr.idGrupoCnvr", "grupoCnvr")
                .innerJoinAndSelect("cnvr.idRecursoForestal", "recursoForestal")
                .where("grupoCnvr.idGrupoCnvr = :idGrupoCnvr", { idGrupoCnvr });

            if (bloqueado !== undefined) {
                consulta = consulta.andWhere("cnvr.bloqueado = 'False'")
            }

            consulta.getMany().then(cnvrList => subscriber.next(cnvrList));
        };
        return this.runQuery(queryFunction);
    }

    getCnvrLrByLr(lr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(CnvrLr);
            return repository.createQueryBuilder("cnvr_lr")
                .innerJoinAndSelect("cnvr_lr.idGrupoCnvr", "grupoCnvr")
                .innerJoinAndSelect("cnvr_lr.idLr", "lr")
                .where("lr.idLr = :lr", { lr })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getCnvrLrByZamif(lrs: number[]) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GrupoCnvr);
            return repository.createQueryBuilder("cnvr")
                .innerJoinAndSelect("cnvr.cnvrLrs", "cnvrLr")
                .innerJoinAndSelect("cnvrLr.idLr", "lr")
                .where("lr.idLr IN (:...ids)", {
                    ids: lrs,
                })
                .getMany().then(grupoList => subscriber.next(grupoList));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateGrupoCnvr(grupo: GrupoCnvr) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoCnvr);
            const item = repo.create(grupo);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteGrupoCnvr(grupo: GrupoCnvr) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoCnvr);
            const item = repo.create(grupo);
            repo.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateCnvr(cnvr: Cnvr) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Cnvr);
            const item = repo.create(cnvr);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }


    saveOrUpdateCnvrLr(cnvr: CnvrLr) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(CnvrLr);
            const item = repo.create(cnvr);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteCnvrByGrupoCnvr(idGcnvr: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM CNVR " +
                "WHERE IdGrupoCNVR = " + idGcnvr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
      }

      deleteCnvrLrByGrupoCnvr(idGcnvr: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM CNVR_LR " +
                "WHERE IdGrupoCNVR = " + idGcnvr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
      }

      deleteCnvrByRecurso(idRecursoForestal: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM CNVR " +
                "WHERE IdRecursoForestal = " + idRecursoForestal).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
      }
    }