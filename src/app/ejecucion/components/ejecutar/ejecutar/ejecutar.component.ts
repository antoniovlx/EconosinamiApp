import { Component, OnInit } from '@angular/core';
import { of, concat, firstValueFrom, Observable } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { DatosEjecucionService } from 'src/app/ejecucion/services/datos-ejecucion.service';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService } from 'src/app/services/app.service';
import { HelperService } from 'src/app/services/helper.service';
import { UiService } from 'src/app/services/ui.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { Dcf } from 'src/entities/Dcf';
import { Dcflr } from 'src/entities/Dcflr';
import { Ejecuciones } from 'src/entities/Ejecuciones';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Lr } from 'src/entities/Lr';
import { Opciones } from 'src/entities/Opciones';
import { TamanosIntensidad } from 'src/entities/TamanosIntensidad';
import { Zamif } from 'src/entities/Zamif';

class cSimulacion {
  CostoRecarga: number
  CostoUnitarioPorMision: number
  IdGrupoMedios: number
  IdInventarioMedios: number
  IdLR: number
  IdMedio: number
  Intensidad: number
  MaximoDescargas: number
  NecesitaAgua: boolean
  Rendimiento: number
  RendimientoRecargas: number
  TiempoLlegada: number
  TiempoParaRelleno: number
  TiempoRecarga: number
  TipoAeronave: string
  TipoUnidad: number
}

class Value {
  val: number[] = new Array(2);
}

class sRecursosForestales {
  id: number;
  periodoPosterior: number;
  decFactor: number;
};

class sDCF {
  NumFuegos: number[] = [];
  VelPropMax: Value[] = []
};

class sZAMIF {
  ModComb: number[] = [];
  Porc: number[] = [];
  SuperficieDet: number;
  PerimEsc: number;
  MinutosEsc: number;
  AreaMaxQuemada: number;
  PerimetroDecubrimiento: number;
  DCF: sDCF;
};

class sDCFLR {
  SuperficieEsc: Value[] = [];
};

class sLR {
  IdLR: number;
  Pct: number;
  TiempoRecAutobomba: number;   // WaterMin
  TiempoRecHelicoptero: number; // HeliReloadMin
  TiempoRecACT: number;         // SEATReloadMin
  TiempoRecAvionAnf: number;    // ATReloadMin
  RetardoRecursos: number;
  DCFLR: sDCFLR = new sDCFLR();
};

//let IdZAMIF: number;
//let IdGDCF: number;
//let IdOpcion: number;
let ZAMIF: sZAMIF;
//let LRs: Array<sLR> = [];
let TamanoIntensidad: Array<number> = [];

class sAT {
  Comienzo: number;
  NecesitaAgua: boolean;
  Descargas: number;
  Demora: number;
  Id: number;
  LineaCreada: number;
  Costo: number;
};

class sRecarga {
  Comienzo: number;
  Duracion: number;
  Demora: number;
  Id: number;
  Completo: number;
  Reducido: number;
  EnAccion: boolean;
};

let ATs: Array<sAT>;
let Recargas: Array<sRecarga>;
let NuevosATs: number, NuevasRecargas: number;

let LlegadaAutobomba: number, LlegadaTierra: number, LlegadaAgua: number;
let ATNeedsGround: number;
let DetenerEjecucion: boolean;
let UltimoMinuto: number; // intLastMin
let MinutoActual: number; // intThisMin
let MinutoComienzo: number; // intBeginMin

let LineaCreada: number; // sngLineBuilt
let Rendimiento: number;
let CostoPorMision; // lngRunUMC

let AreaFuego; // sngFireAcres
let PerimetroFuego; // sngFirePerim

enum eTipoEvento {
  eFuegoDescubierto, // D
  eComienzaProduccion, // B
  eEnEscena, // P
  eEsperandoAgua, // X
  eRealizaDescargaAerea, // W
  eDescargaAereaNoEfectiva, // I
  eVuelve, // R
  eSaleParaRecargar, // L
  eEscapadoPorTamano, // S
  eEscapadoPorTiempo, // T
  eControlado // C
};


@Component({
  selector: 'app-ejecutar',
  templateUrl: './ejecutar.component.html',
  styleUrls: ['./ejecutar.component.scss'],
})
export class EjecutarComponent implements OnInit {

  zamifList: Zamif[];
  opcionesEjecucion: Opciones[];
  gruposComportamientoFuego: GruposDcf[];

  selectedZamif: number[];
  selectedOpciones: number[];
  selectedGrupos: number[];
  displayedColumns = ['titulo']
  lrsSelected: Lr[];
  tamanosIntensidad: TamanosIntensidad[];

  buttons = {
    refComponent: this,
    buttons: []
  }



  constructor(private appService: AppService, private zonasService: ZonasService,
    private ejecucionService: EjecucionService,
    private datosEjecucionService: DatosEjecucionService, private helperService: HelperService, private uiService: UiService) {
    this.selectedZamif = [];
    this.selectedOpciones = [];
    this.selectedGrupos = [];
  }

  ngOnInit() {
    this.zonasService.getAllZamif().subscribe(values => {
      this.zamifList = values;
      this.selectedZamif.push(this.zamifList[0].idZamif);
      this.setButtons();
    })

    this.ejecucionService.getAllOpcionesEjecucion().subscribe(values => {
      this.opcionesEjecucion = values;
      this.selectedOpciones.push(this.opcionesEjecucion[0].idOpcion);
      this.setButtons();
    })

    this.zonasService.getGdcfList().subscribe(values => {
      this.gruposComportamientoFuego = values;
      this.selectedGrupos.push(this.gruposComportamientoFuego[0].idGdcf);
      this.setButtons();
    })

  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Ejecutar simulación", action: "ejecutar", icon: "build", class: "green-icon", disabled: this.selectedZamif.length === 0 || this.selectedOpciones.length === 0 || this.selectedGrupos.length === 0 });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isSelectedZamif(idZamif) {
    return this.selectedZamif.includes(idZamif);
  }

  isSelectedGdcf(idGdcf) {
    return this.selectedGrupos.includes(idGdcf);
  }

  isSelectedOpciones(idOpcion) {
    return this.selectedOpciones.includes(idOpcion);
  }

  updateZamif(selected, idZamif) {
    var index = this.selectedZamif.indexOf(idZamif);

    // selected + exist = no acción
    // not selected + exist = borrar 
    // selected + no exist = añadir
    // not selected + no exist = no acción

    if (!selected.checked && index !== -1) {
      this.selectedZamif.splice(index, 1);
    } else if (selected.checked && index === -1) {
      this.selectedZamif.push(idZamif)
    }

    this.setButtons();
  }


  updateOpciones(selected, idOpcion) {
    var index = this.selectedOpciones.indexOf(idOpcion);

    if (!selected.checked && index != -1) {
      this.selectedOpciones.splice(index, 1);
    } else if (selected.checked && index == -1) {
      this.selectedOpciones.push(idOpcion)
    }

    this.setButtons();
  }

  updateGdcf(selected, idGdcf) {
    var index = this.selectedGrupos.indexOf(idGdcf);

    if (!selected.checked && index != -1) {
      this.selectedGrupos.splice(index, 1);
    } else if (selected.checked && index == -1) {
      this.selectedGrupos.push(idGdcf)
    }

    this.setButtons();
  }


  ejecutar() {
    this.uiService.presentLoading("Simulando...");
    this.lecturaParametros();
    this.uiService.presentToast("Simulación completada");
    this.uiService.dismissLoading();
  }

  async lecturaParametros() {
    // Zamif
    for (let i = 0; i < this.selectedZamif.length; i++) {
      // Opciones
      for (let j = 0; j < this.selectedOpciones.length; j++) {
        // GDCF
        for (let k = 0; k < this.selectedGrupos.length; k++) {
          let LRs = [];
          let idZamif = this.selectedZamif[i];
          let idGdfc = this.selectedGrupos[k];
          let idOpcion = this.selectedOpciones[j];
          let idEjecucion = 0;


          let ejecuciones = await firstValueFrom(this.ejecucionService.getEjecucionesByParameters(idZamif, idGdfc, idOpcion));

          if (ejecuciones.length !== 0) {
            ejecuciones.forEach(element => {
              this.ejecucionService.deleteEjecucion(element.idEjecucion).subscribe();
            })
          }
          let ejecucion = new Ejecuciones(idZamif, idOpcion, idGdfc);
          let max = await firstValueFrom(this.ejecucionService.getMaxIdEjecucion());
          ejecucion.idEjecucion = max[0].max === null ? 1 : max[0].max + 1;
          let newEjecuciones = await firstValueFrom(this.ejecucionService.saveOrUpdateEjecuciones(ejecucion));
          idEjecucion = newEjecuciones.idEjecucion;

          // leer zamif
          let zamif = await firstValueFrom(this.zonasService.getZamifById(idZamif));
          this.leerZamif(zamif);
          this.lrsSelected = zamif.lrs;

          // leer dcf
          let dfcs = await firstValueFrom(this.zonasService.getDcfByGfcdAndZamif(idGdfc, zamif.idZamif));
          ZAMIF.DCF = new sDCF();
          for (let index = 0; index < dfcs.length; index++) {
            const dcf = dfcs[index];
            this.leerDcf(dcf);
          }

          // leer dcflr
          for (let index = 0; index < this.lrsSelected.length; index++) {
            const element = this.lrsSelected[index];
            let dcflr = await firstValueFrom(this.zonasService.getDcflrsByGfcdAndLr(idGdfc, element.idLr));
            this.leerDcflr(element, dcflr, LRs)
          }

          let tamanos = await firstValueFrom(this.ejecucionService.getTamanosIntensidad());
          this.leerTamanosIntensidad(tamanos);

          this.simular(idEjecucion, idOpcion, LRs);
        }
      }
    }
  }

  simular(idEjecucion: number, idOpcion: number, LRs: Array<sLR>) {
    for (let runLR = 0; runLR < LRs.length; runLR++) {
      for (let intensidad = 0; intensidad < 6; intensidad++) {
        let frecuencia = ZAMIF.DCF.NumFuegos[intensidad] * LRs[runLR].Pct;
        if (frecuencia > 0) {
          this.ejecucionService.getSimulacionConsulta(intensidad, idOpcion, LRs[runLR].IdLR).pipe(
            mergeMap((resultados: cSimulacion[]) => {
              this.obtienePrimeroLlegar(resultados);
              ATNeedsGround = (intensidad == 0) ? 60 : 30;
              for (let perc5090 = 0; perc5090 < 2; perc5090++) {
                this.InicializaAT();
                this.InicializaRecargas();
                LineaCreada = 0; Rendimiento = 0; CostoPorMision = 0;
                DetenerEjecucion = false;
                UltimoMinuto = 1;
                this.DebugEvento(eTipoEvento.eFuegoDescubierto);
                let index = 0;
                while (!DetenerEjecucion && index < resultados.length) {
                  const resultado = resultados[index];
                  MinutoActual = resultado.TiempoLlegada;
                  this.ChequearEstado(idEjecucion, runLR, intensidad, perc5090, frecuencia, LRs);
                  if (!DetenerEjecucion) {
                    this.ProcesarInventarioMedios(runLR, intensidad, resultado, LRs);
                    UltimoMinuto = MinutoActual;
                  }
                  index++;
                }
                if (!DetenerEjecucion) {
                  MinutoActual = ZAMIF.MinutosEsc + 1;
                  if (LlegadaTierra < 0)
                    LlegadaTierra = MinutoActual;
                  this.ChequearEstado(idEjecucion, runLR, intensidad, perc5090, frecuencia, LRs);
                }
              }
              return this.zonasService.getZamifById(0);
            })
          ).subscribe(result => {

          });
        }
      }
    }
  }

  ProcesarInventarioMedios(lr: number, intensidad: number, resultado: cSimulacion, LRs) {
    let nuevoRendimiento = 0;
    CostoPorMision = resultado.CostoUnitarioPorMision

    let tipoEvento = (TamanoIntensidad[intensidad] > 0) ? eTipoEvento.eComienzaProduccion : eTipoEvento.eEnEscena;
    let tipoUnidad = resultado.TipoUnidad;
    switch (tipoUnidad) {
      case 1:
        this.DebugEvento(tipoEvento);
        nuevoRendimiento = resultado.Rendimiento;
        break;
      case 2:
        if (resultado.NecesitaAgua && MinutoComienzo < LlegadaAgua)
          this.DebugEvento(eTipoEvento.eEsperandoAgua);
        else if (MinutoComienzo + ATNeedsGround >= LlegadaTierra) {
          this.DebugEvento(eTipoEvento.eRealizaDescargaAerea);
          LineaCreada += this.LineaDescarga(resultado.Rendimiento);
        } else {
          this.DebugEvento(eTipoEvento.eDescargaAereaNoEfectiva);
        }
        this.NuevoAT(lr, resultado, LRs);
        break;
      case 3:
        if (resultado.TiempoParaRelleno === 0 || (resultado.TiempoParaRelleno) > 0 && LRs[lr].RetardoRecursos > 0) {
          this.DebugEvento(tipoEvento);
          nuevoRendimiento = resultado.Rendimiento
        }
        else {
          this.DebugEvento(tipoEvento);
          this.NuevaRecarga(lr, resultado, LRs);
          nuevoRendimiento = resultado.Rendimiento;
        }
    }
    Rendimiento += nuevoRendimiento / 60.0;
  }

  NuevaRecarga(lr: number, resultado: cSimulacion, LRs) {
    let recarga = new sRecarga();
    recarga.Comienzo = MinutoComienzo;
    recarga.Duracion = resultado.TiempoParaRelleno;
    recarga.Demora = resultado.TiempoRecarga;
    if (recarga.Demora <= 0)
      recarga.Demora = LRs[lr].TiempoRecAutobomba;
    recarga.Id = resultado.IdMedio;
    recarga.Completo = this.LineaDescarga(resultado.Rendimiento);
    recarga.Reducido = resultado.RendimientoRecargas;
    recarga.EnAccion = false;
    NuevasRecargas++;
  }

  NuevoAT(lr: number, resultado: cSimulacion, LRs) {
    let at = new sAT();
    at.Comienzo = MinutoComienzo;
    at.NecesitaAgua = resultado.NecesitaAgua;
    at.Descargas = resultado.MaximoDescargas - 1;
    if (at.Descargas < 0)
      at.Descargas = 98;
    at.Demora = resultado.TiempoRecarga;
    if (at.Demora <= 0)
      at.Demora = LRs[lr].TiempoRecAvionAnf;
    at.Id = resultado.IdMedio;
    at.LineaCreada = this.LineaDescarga(resultado.Rendimiento);
    at.Costo = resultado.CostoRecarga;
    ATs.push(at);
    //  NuevosATs++;
  }

  LineaDescarga(rendimiento: number) {
    return rendimiento;
  }

  ChequearEstado(idEjecucion: number, lr: number, intensidad: number, perc5090: number, frecuencia: number, LRs) {

    for (let minuto = UltimoMinuto + 1; minuto <= MinutoActual && !DetenerEjecucion; minuto++) {
      MinutoComienzo = minuto + TamanoIntensidad[intensidad];

      this.ProcesarATs(intensidad, perc5090);
      this.ProcesarRecargas(intensidad, perc5090);

      LineaCreada += Rendimiento;
      //LRs[lr].DCFLR.SuperficieEsc[intensidad] = new Value();
      this.ChequearFin(idEjecucion, lr, intensidad, perc5090, frecuencia, LRs);
    }
  }

  ChequearFin(idEjecucion: number, lr: any, intensidad: number, perc5090: number, frecuencia: number, LRs) {
    AreaFuego = this.helperService.areaByMinVel(MinutoComienzo, ZAMIF.DCF.VelPropMax[intensidad].val[perc5090], ZAMIF.SuperficieDet);
    PerimetroFuego = this.helperService.perimetro(MinutoComienzo, ZAMIF.DCF.VelPropMax[intensidad].val[perc5090], intensidad);
    if (MinutoComienzo < LlegadaTierra || LlegadaTierra < 0)
      return;

    if (AreaFuego >= this.helperService.areaByPerimetro(ZAMIF.PerimEsc)) {
      AreaFuego = LRs[lr].DCFLR.SuperficieEsc[intensidad].val[perc5090];
      PerimetroFuego = this.helperService.perimetroDescubrimiento(AreaFuego);
      this.DebugEvento(eTipoEvento.eEscapadoPorTamano);
      this.ProcesarEvento(idEjecucion, LRs[lr].IdLR, intensidad, perc5090, eTipoEvento.eEscapadoPorTamano, frecuencia);
      DetenerEjecucion = true;
    } else if (LineaCreada >= PerimetroFuego) {
      this.DebugEvento(eTipoEvento.eControlado);
      this.ProcesarEvento(idEjecucion, LRs[lr].IdLR, intensidad, perc5090, eTipoEvento.eControlado, frecuencia);
      DetenerEjecucion = true;
    } else if (MinutoComienzo >= ZAMIF.MinutosEsc) {
      AreaFuego = LRs[lr].DCFLR.SuperficieEsc[intensidad].val[perc5090];
      PerimetroFuego = this.helperService.perimetroDescubrimiento(AreaFuego);
      this.DebugEvento(eTipoEvento.eEscapadoPorTiempo);
      this.ProcesarEvento(idEjecucion, LRs[lr].IdLR, intensidad, perc5090, eTipoEvento.eEscapadoPorTiempo, frecuencia);
      DetenerEjecucion = true;
    }
  }
  async ProcesarEvento(idEjecucion: number, idLR: number, intensidad: number, perc5090: number, tipoEvento: eTipoEvento, frecuencia: number) {
    const areaFuego = AreaFuego;
    const perimetroFuego = PerimetroFuego;
    const lineaCreada = LineaCreada;
    const minutoComienzo = MinutoComienzo;
    const costoPorMision = CostoPorMision;

    if (tipoEvento != eTipoEvento.eEscapadoPorTamano &&
      tipoEvento != eTipoEvento.eEscapadoPorTiempo &&
      tipoEvento != eTipoEvento.eControlado)
      return;


    let consulta = "INSERT INTO Ejecucion(IdEjecucion, IdLR, Intensidad, " +
      "Percentil, Frecuencia, Area, Perimetro, LineaCreada, Status, Descripcion, Costo, CPH, CNVR, Minuto) " +
      "VALUES(" + idEjecucion + ", " + idLR + ", " + (intensidad + 1) + ", " + (perc5090 == 0 ? "50" : "90") + ", " +
      frecuencia + ", " + areaFuego + ", " + perimetroFuego + ", " + lineaCreada;

    if (tipoEvento == eTipoEvento.eEscapadoPorTamano)
      consulta += ", 'S', 'Tamaño', 0";
    else if (tipoEvento == eTipoEvento.eEscapadoPorTiempo)
      consulta += ", 'T', 'Tiempo', 0";
    else
      consulta += ", 'C', 'Controlado', " + costoPorMision;

    consulta += "," + await this.ObtenerCPHLR(idLR, areaFuego) + ", " +
      areaFuego * await this.ObtenerNVC(idLR, 0, intensidad) + ", " +
      minutoComienzo + ")"

    this.ejecucionService.insertarEjecucionSimulacion(consulta).subscribe();
  }

  async ObtenerNVC(idLR: number, idRecursoForestal: number, intensidad: number) {
    let nvc = 0;
    let res = await firstValueFrom(this.datosEjecucionService.getNVC(idLR, idRecursoForestal, intensidad));
    if (res.length != 0) {
      nvc = res[0].NVC;
    }
    return nvc;
  }
  async ObtenerCPHLR(idLR: number, hectareas: number) {
    let costo = 0;
    let cphrslr = await firstValueFrom(this.zonasService.getCphsLrAndHectareas(idLR, hectareas));
    if (cphrslr.length != 0) {
      costo = cphrslr[0].baseAnterior + cphrslr[0].incHectarea * (hectareas - cphrslr[0].sobreHectareas)
    }
    return costo;
  }

  ProcesarRecargas(intensidad: number, perc5090: number) {
    if (Recargas.length > 0) {
      AreaFuego = this.helperService.areaByMinVel(MinutoComienzo, ZAMIF.DCF.VelPropMax[intensidad].val[perc5090], ZAMIF.SuperficieDet);
      PerimetroFuego = this.helperService.perimetro(MinutoComienzo, ZAMIF.DCF.VelPropMax[intensidad].val[perc5090], intensidad);
      if (MinutoComienzo >= LlegadaAutobomba) {
        for (let i = 0; i < Recargas.length; i++) {
          if (Recargas[i].EnAccion) {
            Rendimiento += Recargas[i].Completo - Recargas[i].Reducido;
            this.DebugEvento(eTipoEvento.eVuelve);
          }
        }
        this.InicializaRecargas();
      } else {
        for (let i = 0; i < Recargas.length - NuevasRecargas; i++) {
          let periodo = Recargas[i].Duracion + Recargas[i].Demora;
          if ((MinutoComienzo % periodo) == (Recargas[i].Comienzo % periodo))
            this.DebugEvento(eTipoEvento.eVuelve);
          if ((MinutoComienzo % periodo) == ((Recargas[i].Comienzo + Recargas[i].Duracion) % periodo))
            this.DebugEvento(eTipoEvento.eSaleParaRecargar);
          if (Recargas[i].EnAccion && (MinutoComienzo % periodo) == ((Recargas[i].Comienzo + 1) % periodo)) {
            Rendimiento += Recargas[i].Completo - Recargas[i].Reducido;
            Recargas[i].EnAccion = false;
          }
          if (!Recargas[i].EnAccion && (MinutoComienzo % periodo) == ((Recargas[i].Comienzo + Recargas[i].Duracion + 1) % periodo)) {
            Rendimiento += Recargas[i].Reducido - Recargas[i].Completo;
            Recargas[i].EnAccion = true;
          }
        }
        NuevasRecargas = 0;
      }
    }
  }

  ProcesarATs(intensidad: number, perc5090: number) {
    if (ATs.length > 0) {
      for (let i = 0; i < ATs.length - NuevosATs; i++) {
        for (let descarga = 0; descarga < ATs[i].Descargas; descarga++) {
          if (MinutoComienzo == ATs[i].Comienzo + descarga * ATs[i].Demora) {
            AreaFuego = this.helperService.areaByMinVel(MinutoComienzo, ZAMIF.DCF.VelPropMax[intensidad].val[perc5090], ZAMIF.SuperficieDet);
            PerimetroFuego = this.helperService.perimetro(MinutoComienzo, ZAMIF.DCF.VelPropMax[intensidad].val[perc5090], intensidad);
            if (ATs[i].NecesitaAgua && MinutoComienzo < LlegadaAgua) {
              this.DebugEvento(eTipoEvento.eEsperandoAgua);
            } else if (MinutoComienzo + ATNeedsGround >= LlegadaTierra) {
              CostoPorMision += ATs[i].Costo;
              this.DebugEvento(eTipoEvento.eRealizaDescargaAerea);
              LineaCreada += ATs[i].LineaCreada;
            } else {
              this.DebugEvento(eTipoEvento.eDescargaAereaNoEfectiva);
            }
            break;
          }
        }
      }
      NuevosATs = 0;
    }
  }

  DebugEvento(tipoEvento: eTipoEvento) {
    switch (tipoEvento) {
      case eTipoEvento.eFuegoDescubierto:
        // Fire Discovered
        break;
      case eTipoEvento.eComienzaProduccion:
        // Begins Production
        break;
      case eTipoEvento.eEnEscena:
        // On Scene, Producing
        break;
      case eTipoEvento.eEsperandoAgua:
        // Waiting For Water
        break;
      case eTipoEvento.eRealizaDescargaAerea:
        // Makes Aerial Drop
        break;
      case eTipoEvento.eDescargaAereaNoEfectiva:
        // Ineffective Water Drop
        break;
      case eTipoEvento.eVuelve:
        // Returns
        break;
      case eTipoEvento.eSaleParaRecargar:
        // Departs To Refill
        break;
      case eTipoEvento.eEscapadoPorTamano:
        // Escape Due To Size
        break;
      case eTipoEvento.eEscapadoPorTiempo:
        // Escapes Due To Time
        break;
      case eTipoEvento.eControlado:
        // Fire Contained
        break;
    }
  }

  leerDcflr(element: Lr, dcflrs: Dcflr[], LRs) {
    let lr: sLR = new sLR();
    lr.IdLR = element.idLr;
    lr.Pct = element.pct;
    lr.TiempoRecAutobomba = element.tiempoRecAutobomba;
    lr.TiempoRecHelicoptero = element.tiempoRecHelicoptero;
    lr.TiempoRecACT = element.tiempoRecAct;
    lr.TiempoRecAvionAnf = element.tiempoRecAvionAnf;
    lr.RetardoRecursos = element.retardoRecursos;
    for (let index = 0; index < dcflrs.length; index++) {
      const dcflr = dcflrs[index];
      let intensidad = dcflr.intensidad;

      if (intensidad >= 1 && intensidad <= 6) {
        lr.DCFLR.SuperficieEsc[intensidad - 1] = new Value();
        lr.DCFLR.SuperficieEsc[intensidad - 1].val[0] = dcflr.superficieEsc50pctl;
        lr.DCFLR.SuperficieEsc[intensidad - 1].val[1] = dcflr.superficieEsc90pctl;
      }
    }
    LRs.push(lr);
  }

  // Leer ZAMIF   
  leerZamif(zamif: Zamif) {
    ZAMIF = new sZAMIF();
    ZAMIF.ModComb = [zamif.modComb1, zamif.modComb2, zamif.modComb3];
    ZAMIF.Porc = [zamif.porc1, zamif.porc2, zamif.porc3];
    ZAMIF.SuperficieDet = zamif.superficieDet;
    ZAMIF.PerimEsc = zamif.perimEsc;
    ZAMIF.MinutosEsc = zamif.horasEsc * 60.0;
    ZAMIF.AreaMaxQuemada = zamif.areaMaxQuemada;
    ZAMIF.PerimetroDecubrimiento = this.helperService.perimetroDescubrimiento(ZAMIF.SuperficieDet);
  }


  leerDcf(dcf: Dcf) {
    let intensidad = dcf.intensidad;

    if (intensidad >= 1 && intensidad <= 6) {
      ZAMIF.DCF.NumFuegos[intensidad - 1] = dcf.numFuegos;
      ZAMIF.DCF.VelPropMax[intensidad - 1] = new Value();
      ZAMIF.DCF.VelPropMax[intensidad - 1].val[0] = dcf.velPropMax50pctl;
      ZAMIF.DCF.VelPropMax[intensidad - 1].val[1] = dcf.velPropMax90pctl;
    }
  }

  leerTamanosIntensidad(tamanos: TamanosIntensidad[]) {
    for (let index = 0; index < 6; index++) {
      TamanoIntensidad[index] = 0;
    }

    for (let index = 0; index < tamanos.length; index++) {
      const tamano = tamanos[index];
      let intensidad = tamano.intensidad;
      if (intensidad >= 1 && intensidad <= 6)
        TamanoIntensidad[intensidad - 1] = tamano.hastaHectareas;
    }
  }

  /**
   * 
   * @param resultados_simulaciones 
   * 
   * MaximoDescargas
   * NecesitaAgua
   * Rendimiento
   * RendimientoRecargas
   * TiempoLlegada
   * TiempoParaRelleno
   * TiempoRecarga
   * TipoAeronave
   * TipoUnidad
   */

  obtienePrimeroLlegar(resultados_simulaciones: cSimulacion[]) {
    LlegadaAutobomba = LlegadaTierra = LlegadaAgua = -1;

    let index = 0;
    while (index < resultados_simulaciones.length && (LlegadaAutobomba < 0 || LlegadaTierra < 0 || LlegadaAgua < 0)) {
      const resultado = resultados_simulaciones[index];
      if (LlegadaAutobomba < 0 && resultado.TipoUnidad == 1) {
        LlegadaAutobomba = resultado.TiempoLlegada;
        if (LlegadaTierra < 0)
          LlegadaTierra = LlegadaAutobomba;
      } else if (LlegadaTierra < 0 && resultado.TipoUnidad == 3)
        LlegadaTierra = resultado.TiempoLlegada;
      if (LlegadaAgua < 0 && !resultado.TipoAeronave === null && resultado.TiempoLlegada.toString() == "B")
        LlegadaAgua = resultado.TiempoLlegada;
      index++;
    }
    if (LlegadaAutobomba >= 0 && LlegadaAutobomba < LlegadaAgua)
      LlegadaAgua = LlegadaAutobomba;
  }

  InicializaAT() {
    NuevosATs = 0;
    ATs = [];
  }

  InicializaRecargas() {
    NuevasRecargas = 0;
    Recargas = [];
  }
}