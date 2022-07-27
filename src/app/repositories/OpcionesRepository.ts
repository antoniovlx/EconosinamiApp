import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { Opciones } from "src/entities/Opciones";
import { RatiosProduccion } from "src/entities/RatiosProduccion";
import { TipoAeronave } from "src/entities/TipoAeronave";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class OpcionesRepository extends MainRepository {

    getAllOpciones(): Observable<Opciones[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Opciones);
            return repository.find({ relations: ["idFdr", "idGrupoEjecucion"] }).then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateOpciones(opcion: Opciones) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Opciones);
            const item = repository.create(opcion);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteOpciones(opcion: Opciones) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Opciones);
            const item = repository.create(opcion);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}