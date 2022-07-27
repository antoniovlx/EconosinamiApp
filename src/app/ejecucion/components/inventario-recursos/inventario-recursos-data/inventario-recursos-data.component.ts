import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { InventarioMedios } from 'src/entities/InventarioMedios';
import { Lr } from 'src/entities/Lr';
import { Medios } from 'src/entities/Medios';
import { Zamif } from 'src/entities/Zamif';

@Component({
  selector: 'app-inventario-recursos-data',
  templateUrl: './inventario-recursos-data.component.html',
  styleUrls: ['./inventario-recursos-data.component.scss'],
})
export class InventarioRecursosDataComponent implements OnInit, IDataContainer {

  displayedColumns: string[] = ['medio', 'rendimiento', 'llegada', 'coste unitario', 'tiempo recarga', 'coste recarga', 'rendimiento recarga'];

  inventarioMediosData: InventarioMedios[] = [];
  selectedZamif: number;
  selectedLr: number;

  mediosInventario: Medios[] = [];

  zamifList: Zamif[];
  lrList: Lr[];
  delete: boolean = false;
  generated: boolean = false;
  aviso: boolean = false;
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private mediosService: MediosService,
    private zonasService: ZonasService, private ejecucionService: EjecucionService,
    private uiService: UiService, public utilService: UtilService, private appService: AppService) {

  }

  @Input()
  data: any;

  ngOnInit(): void {
    this.mediosService.getMediosWhereCalcularInventario().subscribe(medios => {
      this.mediosInventario = medios;

      if (this.mediosInventario.length == 0) {
        this.uiService.presentAlertToast("FALTA MEDIOS");
      }
    });

    this.initData();
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Generar inventario", action: "generar", icon: "build", class: "blue-icon", disabled: false });
    this.buttons.buttons.push({ label: "Grabar", action: "saveData", icon: "save", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }


  initData() {
    this.zamifList = this.data.zamifList;
    this.selectedZamif = this.zamifList[0].idZamif;

    if (this.zamifList[0].lrs.length != 0) {
      this.lrList = this.zamifList[0].lrs;
      this.selectedLr = this.lrList[0].idLr;
      this.getInventarioMedios();
    }
  }

  getInventarioMedios() {
    this.ejecucionService.getInventarioMedios(this.selectedLr).subscribe(inventario => {
      if (inventario.length == 0) {
        // medios con campo calcularAutoInventario = True
        this.inventarioMediosData = [];
        this.mediosInventario.forEach(medio => {
          const inventario = new InventarioMedios();
          inventario.idMedio = medio;
          inventario.idLr = this.lrList.find(lr => lr.idLr == this.selectedLr);
          this.inventarioMediosData.push(inventario);
        });
      } else {
        this.inventarioMediosData = inventario;
      }
    })
  }

  saveData() {
    this.unSaved = false;

    if (this.aviso) {

      this.inventarioMediosData.forEach(inventario => {
        this.ejecucionService.saveOrUpdateInventarioMedios(inventario).subscribe();
      })
      this.uiService.presentToast("Grabados los cambios en la base de datos");

      this.aviso = false;
    } else {
      this.uiService.presentToast("No hay cambios que grabar");
    }


    this.uiService.presentToast("Mensaje guardado");
  }

  close() {
    this.appService.goPrev();
  }


  async updateZamif(idZamif) {
    let continuar = true;
    if (this.aviso) {

      const confirm = await this.uiService.confirmationAlert("Confirmación",
        "Hay cambios sin grabar. ¿Desea CONTINUAR y perder las modificaciones?"
      );
      if (confirm) {
        continuar = true;
      } else {
        continuar = false;
      }
    }

    if (continuar) {
      this.aviso = false;
      const zamif = this.zamifList.find(zamif => zamif.idZamif == idZamif);
      this.selectedZamif = zamif.idZamif;

      if (zamif.lrs.length != 0) {
        this.lrList = zamif.lrs;
        this.selectedLr = this.lrList[0].idLr;
        this.getInventarioMedios();
      } else {
        this.inventarioMediosData = [];
        this.lrList = []
        this.selectedLr = -1;
        this.uiService.presentAlertToast("FALTA LR")
      }
    }
  }

  updateLr(idLr) {
    let continuar = true;
    if (this.aviso) {
      /*continuar = this.helperService.openConfirmFileDialog("Confirmación",
        "Hay cambios sin grabar. ¿Desea CONTINUAR y perder las modificaciones?");*/
    }
    if (continuar) {
      this.aviso = false;
      this.selectedLr = idLr;
      this.getInventarioMedios();
    }
  }

  isChanged() {
    this.aviso = true;
  }

  /**
   * Generar datos inventario para todo Zamif y LR
   */
  async generar() {
    await this.generarInventario();
    this.generated = true;
    this.getInventarioMedios();
    //this.helperService.openInfoFileDialog("Confirmación", "Confirma Inventario");
  }

  async generarInventario() {
    //this.helperService.openProgressbar("Inventario", "Generando Inventario");

    // Update Medios si Velocidad <= 0
    this.mediosService.updateMediosWhereVelocidadMenor0(this.utilService.Millas_Kilometros(30)).subscribe();

    // Borrar inventario si Medio.CalcularAutoInventario = True
    this.ejecucionService.deleteInventarioByMedio().subscribe();

    // Para cada Zamif
    this.zamifList.forEach(async zamif => {
      await this.calculateByZamif(zamif);
    })
  }

  async calculateByZamif(zamif: Zamif) {
    const idZamif = zamif.idZamif;
    let modComb = [zamif.modComb1, zamif.modComb2, zamif.modComb3];
    let porc = [zamif.porc1, zamif.porc2, zamif.porc3];
    let sumaPorc = porc[0] + porc[1] + porc[2];
    porc[0] *= 100.0 / sumaPorc;
    porc[1] *= 100.0 / sumaPorc;
    porc[2] *= 100.0 / sumaPorc;

    let idsLr = [];

    // para cada medio
    this.mediosInventario.forEach(async (medio) => {
      await this.calculateByLr(medio, modComb, porc, zamif);
    });
  }

  private async calculateByLr(medio: Medios, modComb: number[], porc: number[], zamif: Zamif) {
    const idGrupoMedios = medio.idGrupoMedios == null ? 0 : medio.idGrupoMedios.idGrupoMedios;
    let PRate = 0;
    for (let i = 0; i < 3; i++) {
      let ratios = await firstValueFrom(this.mediosService.getRatiosByGrupoMedioAndModelo(idGrupoMedios, modComb[i]));
      ratios.forEach(ratio => {
        PRate += ratio.ratio * porc[i] / 100.0;
      });
    }

    for (let lr = 0; lr < zamif.lrs.length; lr++) {
      const inventario = new InventarioMedios();
      inventario.idMedio = medio;
      inventario.idLr = zamif.lrs[lr];
      inventario.costoUnitarioPorMision = medio.costeBasico;
      inventario.tiempoLlegada = medio.demoraInicio;
      inventario.rendimiento = parseFloat(PRate.toFixed(3));
      inventario.tipoUnidad = medio.tipoUnidad;

      switch (medio.tipoUnidad) {
        case 1:
          inventario.tiempoParaRelleno = 0;
          inventario.maximoDescargas = 0;
          inventario.costoRecarga = 0;
          break;
        case 2:
          inventario.tiempoParaRelleno = 0;
          inventario.maximoDescargas = medio.maximoDescargas;
          inventario.costoRecarga = medio.costePorRecarga;
          break;
        case 3:
          inventario.tiempoParaRelleno = medio.tiempoParaRelleno == null ? 0 : medio.tiempoParaRelleno;
          inventario.maximoDescargas = 0;
          inventario.costoRecarga = 0;
          break;
        default:
          inventario.tiempoParaRelleno = 0;
          inventario.maximoDescargas = 0;
          inventario.costoRecarga = 0;
      }

      inventario.rendimientoRecargas = 0;
      inventario.tiempoRecarga = 0;


      // diferentes actualizaciones dependiendo de condiciones
      // En Econosinami 1.4 eran varios update en secuencia
      // Distinguimos entre las distancias por carretera (Kilometros) y las aéreas (KilometrosAereos)
      const base = medio.idBase;

      if (base == null || medio.idBase.idBase == 0) {
        inventario.tiempoLlegada = 0;
        inventario.costoUnitarioPorMision = 0;
        inventario.rendimiento = 0;
      } else {
        let distancias = await firstValueFrom(this.zonasService.getDistanciasByLr(inventario.idLr.idLr));
        if (inventario.tipoUnidad != 2) {
          const distancia = distancias.find(distancia => distancia.idBase.idBase == base.idBase && distancia.kilometros > 0);
          if (distancia != undefined) {
            inventario.tiempoLlegada += 60.0 * distancia.kilometros / medio.velocidad;
            inventario.tiempoLlegada = Math.round(inventario.tiempoLlegada);
            inventario.costoUnitarioPorMision += 2 * distancia.kilometros * medio.incrementoPorKm;
            inventario.costoUnitarioPorMision = parseFloat(inventario.costoUnitarioPorMision.toFixed(3));
          }

        } else if (inventario.tipoUnidad == 2) {
          const distancia = distancias.find(distancia => distancia.idBase.idBase == base.idBase && distancia.kilometrosAereos > 0);

          if (distancia != undefined) {
            inventario.tiempoLlegada += 60.0 * distancia.kilometrosAereos / medio.velocidad;
            inventario.tiempoLlegada = Math.round(inventario.tiempoLlegada);
            inventario.costoUnitarioPorMision += 2 * distancia.kilometrosAereos * medio.incrementoPorKm;
            inventario.costoUnitarioPorMision = parseFloat(inventario.costoUnitarioPorMision.toFixed(3));
          }

          if (medio.tipoAeronave == 'A') {
            inventario.tiempoRecarga = inventario.idLr.tiempoRecAct;
          } else if (medio.tipoAeronave == 'H') {
            inventario.tiempoRecarga = inventario.idLr.tiempoRecHelicoptero;
          } else if (medio.tipoAeronave == 'F') {
            inventario.tiempoRecarga = inventario.idLr.tiempoRecAvionAnf;
          }
        }
      }

      if (inventario.tipoUnidad == 3 && inventario.idLr.tiempoRecAutobomba > 0) {
        inventario.tiempoRecarga = 0;
        inventario.rendimientoRecargas = 0;
      }

      this.ejecucionService.saveOrUpdateInventarioMedios(inventario).subscribe();
    }
  }
}


