import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DataCalibracion } from 'src/app/ejecucion/services/datos-ejecucion.service';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { HelperService } from 'src/app/services/helper.service';
import { sHFT, sLR, sZAMIF } from 'src/app/shared/modelData';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Lr } from 'src/entities/Lr';
import { Opciones } from 'src/entities/Opciones';
import { TamanosIntensidad } from 'src/entities/TamanosIntensidad';
import { Zamif } from 'src/entities/Zamif';
import { DatosCalibracionComponent } from './datos-calibracion/datos-calibracion.component';

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

class sDCFLR {
  SuperficieEsc: Value[] = [];
};


let IdEjecucion: number;
let IdZAMIF: number;
let IdGDCF: number;
let IdOpcion: number;
let ZAMIF: sZAMIF;
let LRs: Array<sLR> = [];
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

let Frecuencia: number;
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
  selector: 'app-ejecutar-calibracion',
  templateUrl: './ejecutar-calibracion.component.html',
  styleUrls: ['./ejecutar-calibracion.component.scss'],
})
export class EjecutarCalibracionComponent implements OnInit {
  displayedColumns = ['titulo']

  zamifList: Zamif[];
  opcionesEjecucion: Opciones[];
  gruposComportamientoFuego: GruposDcf[];

  selectedZamif: number;
  selectedOpciones: number;
  selectedGrupos: number;

  sZamif: sZAMIF;

  textZamif: string;
  textOpciones: string;
  textGrupos: string;
  necesitaCalcular: boolean;
  haCambiado: boolean;
  zamif: Zamif;
  opcion: Opciones;
  gdcf: GruposDcf;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private zonasService: ZonasService,
    private appService: AppService,
    private ejecucionService: EjecucionService, private helperService: HelperService) {

  }

  ngOnInit(): void {
    this.zonasService.getAllZamif().subscribe(values => {
      this.zamifList = values;
      this.selectedZamif = this.zamifList[0].idZamif;
      this.zamif = this.zamifList.find(zamif => zamif.idZamif == this.selectedZamif)
      this.setButtons();
    })

    this.ejecucionService.getAllOpcionesEjecucion().subscribe(values => {
      this.opcionesEjecucion = values;
      this.selectedOpciones = this.opcionesEjecucion[0].idOpcion;
      this.opcion = this.opcionesEjecucion.find(opcion => opcion.idOpcion == this.selectedOpciones)
      this.setButtons();
    })

    this.zonasService.getGdcfList().subscribe(values => {
      this.gruposComportamientoFuego = values;
      this.selectedGrupos = this.gruposComportamientoFuego[0].idGdcf;
      this.gdcf = this.gruposComportamientoFuego.find(grupo => grupo.idGdcf == this.selectedGrupos)
      this.setButtons();
    })
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Ejecutar calibración", action: "ejecutar", icon: "build", class: "blue-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.zamifList.length === 0 || this.opcionesEjecucion.length === 0 || this.gruposComportamientoFuego.length === 0) {
      return true;
    }

    return false;
  }

  updateZamif(idZamif) {
    this.selectedZamif = idZamif;
    this.zamif = this.zamifList.find(zamif => zamif.idZamif == idZamif)
  }

  updateOpciones(idOpcion) {
    this.selectedOpciones = idOpcion;
    this.opcion = this.opcionesEjecucion.find(opcion => opcion.idOpcion == idOpcion)
  }

  updateGdcf(idGdcf) {
    this.selectedGrupos = idGdcf;
    this.gdcf = this.gruposComportamientoFuego.find(grupo => grupo.idGdcf == idGdcf)
  }

  async ejecutar() {
    this.necesitaCalcular = true;
    this.haCambiado = false;

    this.textZamif = this.selectedZamif.toString();
    this.textOpciones = this.selectedOpciones.toString();
    this.textGrupos = this.selectedGrupos.toString();

    this.cargaZAMIF();
    await this.cargaHistorico();
    this.cargaLR();

    const datos = new DataCalibracion();
    datos.zamif = this.zamif;
    datos.sZamif = this.sZamif;
    datos.idGdcf = this.gdcf;
    datos.idOpcion = this.opcion;


    this.appService.loadComponent(new ContainerItem(DatosCalibracionComponent, {
      datos: datos,
      titleComponent: "Calibración",
      isMainComponent: false
    }), this.appService.getRefCurrentDynamicComponent())

  }

  cargaZAMIF() {
    this.sZamif = new sZAMIF();
    this.sZamif.idZamif = this.zamif.idZamif;
    this.sZamif.zamif = this.zamif.zamif;
    this.sZamif.superficieDet = this.zamif.superficieDet;
    this.sZamif.perimEsc = this.zamif.perimEsc;
    this.sZamif.superficieEsc = parseFloat(this.helperService.areaByPerimetro(this.sZamif.perimEsc).toFixed(2));
    this.sZamif.horasEsc = parseFloat(this.zamif.horasEsc.toFixed(2));
  }

  cargaLR() {
    this.zamif.lrs.forEach(lr => {
      const sLr = new sLR();
      sLr.IdLR = lr.idLr;
      sLr.LR = lr.lr;
      sLr.pct = lr.pct / 100;
      this.sZamif.LR.push(sLr);
    });
  }

  async cargaHistorico() {
    let hf = await firstValueFrom(this.ejecucionService.getHistoricoFuegos(this.selectedZamif));
    this.sZamif.HFT.numFuegosTotal = 0;
    hf.forEach(h => {
      const tamano = h.tamano;
      if (tamano >= 1 && tamano <= 6) {
        this.sZamif.HFT.area[tamano - 1] = h.area;
        this.sZamif.HFT.numFuegos[tamano - 1] = h.numFuegos;
        this.sZamif.HFT.numFuegosTotal += this.sZamif.HFT.numFuegos[tamano - 1];
      }
    });
  }


}
