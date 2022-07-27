import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cphlr } from "src/entities/Cphlr";
import { Especie } from "src/entities/Especies";
import { Repository } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class EspecieRepository extends MainRepository {

    getAllEspecies(): Observable<Especie[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Especie);
            return repository.find().then(especieList => subscriber.next(especieList));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateEspecie(especie: Especie) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Especie);
            const item = repository.create(especie);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteEspecie(especie: Especie) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Especie);
            const item = repository.create(especie);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getEspecieById(idEspecie: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Especie);
            return repository.findByIds([idEspecie]).then(especie => subscriber.next(especie));
        };
        return this.runQuery(queryFunction);
    }
}