import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cphlr } from "src/entities/Cphlr";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class CphlrRepository extends MainRepository {

    getCphlrByLr(idLr: number): Observable<Cphlr[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Cphlr);
            return repository.createQueryBuilder("cphlr")
            .where('cphlr.idLr = :lr', { lr: idLr })
            .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction)
    }

    getCphlrByLrAndHectareas(lr: number, hectareas: number): Observable<Cphlr[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Cphlr);
            return repository.createQueryBuilder("cphlr")
            .where('cphlr.idLr = :lr', { lr })
            .andWhere('cphlr.hastaHectareas >= :hectareas', {hectareas})
            .orderBy('cphlr.hastaHectareas')
            .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction)
    }

    saveCphlr(cphlr: Cphlr) {
        let queryFunction = (connection, subscriber) => {
            let repo = this.getDBConnection().getRepository(Cphlr);
            const item = repo.create(cphlr);
            repo.save(item).then((cphlr) => subscriber.next(cphlr));
        };
        return this.runQuery(queryFunction);
    }
    
    
    /*addCostesLr() {
        ipcMain.on('add-cphlr', async (event: any, _item: Cphlr) => {
            try {
                const item = await this.repository.create(_item);
                await this.repository.save(item);
                event.returnValue = await this.repository.find();
            } catch (err) {
                throw err;
            }
        });
    }

    deleteCosteLr() {
        ipcMain.on('delete-cphlr', async (event: any, idLr: number) => {
            try {
                event.returnValue = await this.repository
                .createQueryBuilder()
                .delete()
                .from(Cphlr)
                .where("idLr = :id", { id: idLr })
                .execute();
            } catch (err) {
                throw err;
            }
        });
    }*/
}