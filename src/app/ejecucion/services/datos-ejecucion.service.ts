import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { MediosRepository } from 'src/app/repositories/MediosRepository';
import { SimulacionRepository } from 'src/app/repositories/SimulacionRepository';
import { HelperService } from 'src/app/services/helper.service';
import { sMRT, sZAMIF } from 'src/app/shared/modelData';
import { DatosEjecucion } from 'src/entities/DatosEjecucion';
import { GruposDcf } from 'src/entities/GruposDcf';
import { IntensidadActivacion } from 'src/entities/IntensidadActivacion';
import { Lr } from 'src/entities/Lr';
import { Opciones } from 'src/entities/Opciones';
import { Zamif } from 'src/entities/Zamif';
import { EjecucionService } from './ejecucion.service';

export class DataCalibracion {
  zamif: Zamif;
  sZamif: sZAMIF;
  idOpcion: Opciones;
  idGdcf: GruposDcf;
}

export class DataCalculados {
  lugar?: string;
  intensidad?: number;
  numeroFuegos?: number;
  velocidad50perc?: number;
  tamano50perc?: number;
  frec50perc?: number;
  velocidad90perc?: number;
  tamano90perc?: number;
  frec90perc?: number;
}

export class DataIntensidad {
  data: any[][] = [
    [1, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0],
    [4, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 0],
    [6, 0, 0, 0, 0, 0, 0, 0],
    ["TOTAL", 0, 0, 0, 0, 0, 0, 0],
    ["HISTORICO", 0, 0, 0, 0, 0, 0, 0],
    ["DIFERENCIA", 0, 0, 0, 0, 0, 0, 0],
    ["%", 0, 0, 0, 0, 0, 0, 0],
  ];
}

export class DataEscapados {
  lugar: Lr;
  percentil: number;
  intensidad1: number;
  intensidad2: number;
  intensidad3: number;
  intensidad4: number;
  intensidad5: number;
  intensidad6: number;
}

export const Hectareas: number[] = [
  0.1,
  4.0,
  40.0,
  120.0,
  400.0
];


@Injectable({
  providedIn: 'root'
})
export class DatosEjecucionService {


  FirstGround: number;
  DropsOk: number;
  FirstWater: number;

  datosEjecucion: DatosEjecucion[];
  necesitaCalcular: boolean;
  haCambiado: boolean;

  dataCalculado$ = new Subject<DataCalculados[]>();


  constructor(private ejecucionService: EjecucionService,
    private helperService: HelperService,
    private mediosRepository: MediosRepository,
    private simulacionRepository: SimulacionRepository) { }

  async inicializaEjecuciones(idOpcion: number, IdLR: number, intensidad: number) {
    let firstGround = await firstValueFrom(this.ejecucionService.getDatosEjecucionFirstGround(idOpcion, IdLR, intensidad));
    if (firstGround == 0)
      this.DropsOk = 32000;
    else {
      this.DropsOk = firstGround;
      if (this.DropsOk == 0)
        this.DropsOk = 32000;
    }
    this.FirstGround = this.DropsOk;
    this.DropsOk -= (intensidad == 1 ? 60 : 30);

    let firstWater = await firstValueFrom(this.ejecucionService.getDatosEjecucionFirstWater(idOpcion, IdLR, intensidad));
    if (firstWater == 0)
      this.FirstWater = 32000;
    else {
      this.FirstWater = firstWater;
      if (this.DropsOk == 0)
        this.FirstWater = 32000;
    }
    this.FirstWater = this.DropsOk;
    this.DropsOk -= (intensidad == 1 ? 60 : 30);

    this.datosEjecucion = await firstValueFrom(this.ejecucionService.getDatosEjecucion(idOpcion, IdLR, intensidad));

    return this.datosEjecucion;
  }

  changeDataCalculados$(dataCalculado: DataCalculados[]) {
    this.dataCalculado$.next(dataCalculado);
  }

  calculaDatosEjecucion(zamif: any, lr: any, superficieEsc: any, intensidad: number, testROS: any) {
    let tamano;
    let lineaConstruida = 0;
    let lineaPorMinuto = 0;
    let atFirst = 0;
    let prevMinuto = 0;
    let necesitaAgua: boolean = true, hayAgua = false;

    //map < long, double >
    let HC = new Map();
    // set < long >
    let AT = new Set();

    let finalizar: boolean = false;
    // salir si Finalizar = True
    for (let index = 0; index < this.datosEjecucion.length; index++) {
      const datoEjecucion = this.datosEjecucion[index];

      const minuto = datoEjecucion.minuto;
      if (minuto != prevMinuto) {
        // Add First Drops Next Minute
        lineaConstruida += atFirst;
        atFirst = 0;
      }
      // Check to see if caught/escaped since previous arrival
      for (let chkMinuto = prevMinuto + 1; chkMinuto <= minuto && !finalizar; ++chkMinuto) {
        lineaConstruida += lineaPorMinuto;
        if (chkMinuto >= zamif.horasEsc * 60.0) {
          // Time Escape
          tamano = superficieEsc;
          finalizar = true;
        } else if (this.helperService.perimetro(chkMinuto, testROS, intensidad) >= zamif.perimEsc) {
          // Size Escape
          tamano = superficieEsc;
          finalizar = true;
        } else if (this.helperService.perimetro(chkMinuto, testROS, intensidad)
          && chkMinuto >= this.FirstGround) {
          // Caught
          tamano = this.helperService.areaByMinVel(chkMinuto, testROS, zamif.superficieDet);
          finalizar = true;
        }
      } // for

      if (!finalizar) {
        // OK, process this arrival
        if (necesitaAgua && minuto == this.FirstWater) {
          // Convert all engines (etc) to full production, update lineaPorMinuto
          let lineaPorMinutoAgua = 0; // Next Minute

          for (let [key, value] of HC) {
            if (value != 0) {
              // working as handcrew
              lineaPorMinutoAgua += value / 60.;
            }
          }
          lineaPorMinuto -= lineaPorMinutoAgua;
          lineaConstruida -= lineaPorMinutoAgua; // Don't wait for next minute
          necesitaAgua = false; // To prevent future repeats
        }

        const estado = datoEjecucion.estado;
        switch (estado) {
          case 10:
            lineaPorMinuto += datoEjecucion.rendimiento / 60.;
            // Does WT count as water for heli? (hayAgua)
            break;
          case 20:
            lineaPorMinuto += datoEjecucion.rendimiento / 60.;
            hayAgua = true;
            break;
          case 30:
          case 31:
            {
              const idMedio = datoEjecucion.idMedio.idMedio;
              let encontrado = false;
              //Iterate over set entries
              let count = 0;
              for (let id of AT) {
                count++;
                // encontrar idMedio y que coincida con el elemento final
                if (id == idMedio && count == AT.values.length) {
                  encontrado = true;
                }
              }

              if (!encontrado)
                AT.add(idMedio);

              if ((estado == 30 && minuto >= this.DropsOk)
                || (estado == 31 && hayAgua)) {
                if (encontrado)
                  lineaConstruida += this.helperService.lineaDescarga(/*AsDouble(dsDE, "Descarga")*/ 0);
                else
                  atFirst += this.helperService.lineaDescarga(/*AsDouble(dsDE, "Descarga")*/ 0);
              }
            }
            break;
          case 40:
            lineaPorMinuto += datoEjecucion.rendimiento / 60.;
            break;
          case 61:
          case 62:
            if (minuto < this.FirstWater) {
              const idMedio = datoEjecucion.idMedio.idMedio;
              HC[idMedio] = (estado == 61 ? datoEjecucion.rendimiento : 0);
              lineaPorMinuto += datoEjecucion.rendimiento / 60.;
            }
            break;
        }

        if (lineaConstruida >= this.helperService.perimetro(minuto, testROS, intensidad)
          && minuto >= this.FirstGround) {
          // Caught By Drop(s) This Minute
          tamano = this.helperService.areaByMinVel(minuto, testROS, zamif.superficieDet);
          finalizar = true;
        }

        prevMinuto = minuto;
      }
    }
    return tamano;
  }

  async calcularNumSimulaciones(idOpcion: number, idGDCF: number) {
    let numSimulaciones;

    let consulta = "SELECT COUNT(*) AS valor" +
      "  FROM Ejecuciones, Ejecucion" +
      "  WHERE IdOpcion = " + String(idOpcion) +
      "    AND IdGDCF = " + String(idGDCF) +
      "    AND Ejecuciones.IdEjecucion = Ejecucion.IdEjecucion";

    const res = await firstValueFrom(this.simulacionRepository.getInforme(consulta));
    return res[0].valor;
  }

  async calcularNumEscapados(idOpcion: number, idGDCF: number) {
    let consulta = "SELECT COUNT(*) AS valor" +
      "  FROM Ejecuciones, Ejecucion" +
      "  WHERE IdOpcion = " + String(idOpcion) +
      "    AND IdGDCF = " + String(idGDCF) +
      "    AND Ejecuciones.IdEjecucion = Ejecucion.IdEjecucion" +
      "    AND Status = 'S'";

    const res = await firstValueFrom(this.simulacionRepository.getInforme(consulta));
    return res[0].valor;
  }

  async getCountMediosWhereOpcionCategoria(idOpcion: number, idCategoria: number) {
    const res = await firstValueFrom(this.mediosRepository.countMediosOpcionCategoria(idOpcion, idCategoria));
    return res.count;
  }

  async calcularResultados(campo: string, tipoResultado: string, idOpcion: any, idGDCF: number) {
    let consulta = "SELECT " + tipoResultado + "((" + campo + ") * Frecuencia) AS valor" +
      "  FROM Ejecuciones, Ejecucion" +
      "  WHERE IdOpcion = " + String(idOpcion) +
      "  AND IdGDCF = " + String(idGDCF) +
      "  AND Ejecuciones.IdEjecucion = Ejecucion.IdEjecucion";

    const res = await firstValueFrom(this.simulacionRepository.getInforme(consulta));
    return res[0].valor !== null ? parseFloat(res[0].valor) : 0;
  }

  async calcularPresupuesto(idOpcion: number, idCategoriaMedios?: number) {
    let consulta = "SELECT SUM(P.Presupuesto) AS presupuestoTotal" +
      "  FROM (Medios AS M LEFT JOIN VistaPresupuestos AS P ON M.IdMedio = P.IdMedio)" +
      "  INNER JOIN MediosOpciones AS MO ON M.IdMedio = MO.IdMedio";
      
    if (idCategoriaMedios === undefined) {
      consulta += "  WHERE IdOpcion = " + idOpcion + " AND IdCategoriaMedios > 0";
    }
    else {
      consulta += " WHERE IdOpcion = " + idOpcion +
        "   AND IdCategoriaMedios = " + String(idCategoriaMedios);
    }

    let res = await firstValueFrom(this.simulacionRepository.getInforme(consulta));
    return res[0].presupuestoTotal;
  }

  async calcularAutoOST(opcionesList: Opciones[], zamifList: Zamif[]) {
    for (let index = 0; index < opcionesList.length; index++) {
      const opcion = opcionesList[index];
      const idFdr = opcion.idFdr.idFdr;

      if (idFdr != 0) {
        for (let index = 0; index < zamifList.length; index++) {
          const zamif = zamifList[index];
          if (idFdr < 0) {
            this.calcularOSTSegunIntensidad(opcion, zamif);
          } else {
            for (let index = 0; index < zamif.lrs.length; index++) {
              const lr = zamif.lrs[index];
              let fdr = await firstValueFrom(this.ejecucionService.getAllFdrlrByOpcionLr(opcion.idOpcion, lr.idLr));
              if (fdr.length != 0) {
                this.calcularOSTSegunFDR(opcion, lr, fdr[0].idFdr.idFdr);
              }
              else {
                this.calcularOSTSegunFDR(opcion, lr, idFdr);
              }
            }
          }
        }
      }
    }
  }

  async calcularOSTSegunFDR(opcion: Opciones, lr: Lr, idFdr: number) {
    this.ejecucionService.deleteIntensidadActivacionByOpcionLr(opcion.idOpcion, lr.idLr).subscribe();

    let inventarios = await firstValueFrom(this.ejecucionService.getInventarioByOpcionLr(opcion.idOpcion, lr.idLr));
    let mrt: sMRT[] = [];
    for (let index = 0; index < inventarios.length; index++) {
      const inventario = inventarios[index];

      mrt.push(new sMRT());
      mrt[index].idMedio = inventario.idMedio;
      mrt[index].idDRE = inventario.idMedio.idDre;
      mrt[index].intensidadActivacion = inventario.idMedio.intensidadActivacion;
      mrt[index].tiempoLlegada = inventario.tiempoLlegada;
    }

    let arfList = await firstValueFrom(this.ejecucionService.getArfByFdr(idFdr));
    for (let index = 0; index < arfList.length; index++) {
      const arf = arfList[index];
      let im = 0;
      let idDRE = arf.idDre.idDre;
      let cantidades = [arf.cantidad1, arf.cantidad2, arf.cantidad3,
      arf.cantidad4, arf.cantidad5, arf.cantidad6];

      for (let index = 0; index < cantidades.length; index++) {
        let cantidad = cantidades[index];
        while (cantidad > 0 && im < inventarios.length) {
          if (mrt[im].idDRE.idDre == idDRE && mrt[im].tiempoLlegada > 0) {

            let intensidad = new IntensidadActivacion();
            intensidad.idMedio = mrt[im].idMedio;
            intensidad.idOpcion = opcion;
            intensidad.idLr = lr;
            intensidad.intensidad = ++index;
            this.ejecucionService.saveOrUpdateIntensidadActivacion(intensidad).subscribe();
            cantidad--;
            mrt[im].tiempoLlegada = 0;
          }
          im++;
        }
      }
    }
  }

  async calcularOSTSegunIntensidad(opcion: Opciones, zamif: Zamif) {
    this.ejecucionService.deleteIntensidadActivacionByOpcionZamif(opcion.idOpcion, zamif.idZamif).subscribe();

    let medios = await firstValueFrom(this.ejecucionService.getMediosIntensidadActivacion(opcion.idOpcion));
    for (let index = 0; index < medios.length; index++) {
      const medio = medios[index];
      if (medios.length != 0) {
        for (let index = 0; index < zamif.lrs.length; index++) {
          const lr = zamif[index];
          let intensidad = new IntensidadActivacion();
          intensidad.idMedio = medio;
          intensidad.idOpcion = opcion;
          intensidad.idLr = lr;
          intensidad.idIntensidadActivacion = medio.intensidadActivacion;

          this.ejecucionService.saveOrUpdateIntensidadActivacion(intensidad).subscribe();
        }
      }
    }

  }

  getNVC(idLR: number, idRecursoForestal: number, intensidad: number) {
    return this.simulacionRepository.getNvc(idLR, idRecursoForestal, intensidad);
  }
}
