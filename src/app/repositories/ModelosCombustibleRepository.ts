import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { ModelosCombustible } from "src/entities/ModelosCombustible";
import { RatiosProduccion } from "src/entities/RatiosProduccion";
import { TipoAeronave } from "src/entities/TipoAeronave";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class ModelosCombustibleRepository extends MainRepository {

    getAllModelosCombustible(): Observable<ModelosCombustible[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(ModelosCombustible);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }
}