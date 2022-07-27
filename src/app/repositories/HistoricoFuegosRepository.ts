import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HistoricoFuegos } from "src/entities/HistoricoFuegos";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class HistoricoFuegosRepository extends MainRepository {
    getAllHistoricoFuegosByZamif(idZamif: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(HistoricoFuegos);
            return repository.createQueryBuilder("historico")
            .innerJoinAndSelect("historico.idZamif", "zamif")
            .where("zamif.idZamif = :idZamif", { idZamif })
            .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }


    saveOrUpdateHistoricoFuegos(historico: HistoricoFuegos) {
        /*let queryFunction = (connection, subscriber) => {
            getManager().query(
                "UPDATE HistoricoFuegos SET NumFuegos=" + historico.numFuegos.toString().replace(',', '.') + 
                " ,Area=" + historico.area.toString().replace(',', '.') + 
                " ,Coste=" + historico.coste.toString().replace(',', '.') +
                " WHERE Tamano = " + historico.tamano + " AND idZamif = " + historico.idZamif.idZamif).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);*/

        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(HistoricoFuegos);
            const item = repository.create(historico);
            repository.save(item).then((historico: HistoricoFuegos) => subscriber.next(historico));
        };
        return this.runQuery(queryFunction);
    }

    deleteHistoricoFuegos(historico: HistoricoFuegos) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(HistoricoFuegos);
            const item = repository.create(historico);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteHistoricoByZamif(idZamif: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM HistoricoFuegos " +
                "WHERE idZamif = " + idZamif).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    
}


}