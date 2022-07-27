import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Configuracion } from "src/entities/Configuracion";
import { Connection, Repository } from "typeorm";
import { OrmService } from "../services/orm.service";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionRepository extends MainRepository{

    getConfiguracion(): Observable<Configuracion> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Configuracion);
            return repository.findOne().then((configuracion: Configuracion) => subscriber.next(configuracion));
        };
        return this.runQuery(queryFunction)
    }

    saveOrUpdateConfiguration(configuracion: Configuracion) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Configuracion);
            const item = repository.create(configuracion);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}