import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class SimulacionRepository extends MainRepository {

    getSimulacionConsulta(intensidad: number, idOpcion: number, idLr:number): Observable<any[]> {
        let queryFunction = (connection, subscriber) => {
            return getManager().query("select IM.*, IA.Intensidad, M.IdGrupoMedios, " +
            "M.NecesitaAgua, M.TipoAeronave " +
            "from GrupoMedios GM, InventarioMedios IM, IntensidadActivacion IA, Medios M " +
            "where IA.Intensidad > 0 and IA.Intensidad <= " + String(intensidad + 1) +
            "  and IM.TiempoLlegada > 0" +
            "  and IM.IdMedio = IA.IdMedio" +
            "  and IA.IdOpcion = " + idOpcion +
            "  and IM.IdLR = " + idLr +
            "  and IA.IdLR = " + idLr +
            "  and M.IdMedio = IM.IdMedio" +
            "  and GM.IdGrupoMedios = M.IdGrupoMedios " +
            "order by IM.TiempoLlegada").then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateEjecucion(consulta: string) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(consulta).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getNvc(idLr: number, idRecursoForestal: number, intensidad: number){
        let queryFunction = async (connection, subscriber) => {
            const res = await getManager().query("select IdGrupoCNVR from CNVR_LR where IdLR = " + idLr)
       
            if(res[0].IdGrupoCNVR === null){
                return 0;
            }else{
                let consulta = "select sum(CalcIntensidad" + (intensidad + 1) + ") as NVC " + 
                "from CNVR where IdGrupoCNVR = " + Number.parseInt(res[0].IdGrupoCNVR);

                if(idRecursoForestal > 0){
                    consulta += "and IdRecursoForestal = " + idRecursoForestal;
                }
                return getManager().query(consulta).then(list => subscriber.next(list));
            }
        };
        return this.runQuery(queryFunction);
    }

    getInforme(consulta: string){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(consulta).then(
                (res) => subscriber.next(res));
        };
        return this.runQuery(queryFunction);
    }

 
}