import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IonSlides } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DataCalculados, DataEscapados, DataIntensidad, DatosEjecucionService, Hectareas } from 'src/app/ejecucion/services/datos-ejecucion.service';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { sZAMIF } from 'src/app/shared/modelData';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { Dcf } from 'src/entities/Dcf';
import { Dcflr } from 'src/entities/Dcflr';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Lr } from 'src/entities/Lr';
import { Opciones } from 'src/entities/Opciones';
import { Zamif } from 'src/entities/Zamif';

class DataCalibracion {
  zamif: Zamif;
  sZamif: sZAMIF;
  idOpcion: Opciones;
  idGdcf: GruposDcf;
}

@Component({
  selector: 'app-datos-calibracion',
  templateUrl: './datos-calibracion.component.html',
  styleUrls: ['./datos-calibracion.component.scss'],
})
export class DatosCalibracionComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  datos: any;

  aviso: boolean = false;
  dcfAll: Dcf[] = [];
  dcflrAll: Dcflr[] = [];
  dataEscapados: DataEscapados[] = [];
  dataCalculado: DataCalculados[] = [];
  dataSourceCalculado: MatTableDataSource<DataCalculados>;
  dataHectareasQuemadas: DataIntensidad = new DataIntensidad();
  dataNumeroFuegos: DataIntensidad = new DataIntensidad();
  dataSourceHectareasQuemadas: MatTableDataSource<any>;
  dataSourceNumeroFuegos: MatTableDataSource<any>;
  necesitaCalcular: boolean;
  historicoString: string = '';
  diferenciaString: string = '';

  unSaved: boolean;

  isMobile: boolean;

  segment = '0';

  slideOpts = {
    slidesPerView: 1,
    autoHeight: true
  }

  buttons = {
    refComponent: this,
    buttons: []
  }

  @ViewChild('slider') slider: IonSlides;


  constructor(private appService: AppService, private zonasService: ZonasService,
    private translateService: TranslateService,
    private datosEjecucionService: DatosEjecucionService,
    private uiService: UiService) {

  }

  ngOnInit() {
    this.datos = this.data.datos;

    this.translateService.get(['Histórico', 'Diferencia']).subscribe(res => {
      this.historicoString = res["Histórico"];
      this.diferenciaString = res["Diferencia"];

      this.cargarData();
    });

    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "close", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Recargar", action: "reload", icon: "refresh", class: "blue-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "saveData", icon: "done", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }


  cancelar() {
    this.appService.goPrev();
  }

  ionViewWillEnter() {

  }

  ngAfterViewInit(): void {
    this.slider.lockSwipes(true);
  }

  segmentSelected(index) {
    this.slider.lockSwipes(false);
    this.slider.slideTo(index);
    this.slider.lockSwipes(true);
  }

  async slideChanged() {
    const value = await this.slider.getActiveIndex();
    this.segment = value.toString();
  }

  async cargarData() {
    // cargar datos de grupo de comportamiento del fuego según grupo y zamif
    await this.getDcfList();
    // cargar datos de grupo de comportamiento del fuego según grupo y lr
    await this.getDcflrList();
    
    await this.calcula();
    this.rellenaCalculos();
    this.rellenaHistorico();
    this.cargarFuegosCalculados();
  }

  rellenaHistorico() {
    let totalArea = 0, totalNumero = 0;
    let totalRunArea = [0, 0, 0, 0, 0, 0]
    let totalRunNumero = [0, 0, 0, 0, 0, 0]
    let areaInt: number[] = [0, 0, 0, 0, 0, 0];
    let numeroInt: number[] = [0, 0, 0, 0, 0, 0];
    let totalAreaInt = 0, totalNumeroInt = 0;

    for (let tamano = 1; tamano <= 6; ++tamano) {
      for (let intensidad = 1; intensidad <= 6; ++intensidad) {
        totalRunArea[tamano - 1] += this.datos.sZamif.runHFT[intensidad - 1].area[tamano - 1];
        totalRunNumero[tamano - 1] += this.datos.sZamif.runHFT[intensidad - 1].numFuegos[tamano - 1];
        areaInt[intensidad - 1] += this.datos.sZamif.runHFT[intensidad - 1].area[tamano - 1];
        numeroInt[intensidad - 1] += this.datos.sZamif.runHFT[intensidad - 1].numFuegos[tamano - 1];

        this.dataHectareasQuemadas.data[intensidad - 1][tamano] = this.datos.sZamif.runHFT[intensidad - 1].area[tamano - 1].toFixed(2);
        this.dataNumeroFuegos.data[intensidad - 1][tamano] = this.datos.sZamif.runHFT[intensidad - 1].numFuegos[tamano - 1].toFixed(2);
      }
      totalArea += this.datos.sZamif.HFT.area[tamano - 1];
      totalNumero += this.datos.sZamif.HFT.numFuegos[tamano - 1];

      // Columna Total tamaño
      this.dataHectareasQuemadas.data[6][tamano] = totalRunArea[tamano - 1].toFixed(2); // Total

      this.dataHectareasQuemadas.data[7][0] = this.historicoString;
      this.dataHectareasQuemadas.data[7][tamano] = this.datos.sZamif.HFT.area[tamano - 1].toFixed(2); // Historico

      const difcArea = totalRunArea[tamano - 1] - this.datos.sZamif.HFT.area[tamano - 1];

      this.dataHectareasQuemadas.data[8][0] = this.diferenciaString;
      this.dataHectareasQuemadas.data[8][tamano] = difcArea.toFixed(2); // Diferencia

      this.dataNumeroFuegos.data[6][tamano] = totalRunNumero[tamano - 1].toFixed(2); // Total
      this.dataNumeroFuegos.data[7][0] = this.historicoString;
      this.dataNumeroFuegos.data[7][tamano] = this.datos.sZamif.HFT.numFuegos[tamano - 1].toFixed(2); // Historico

      const difcNumero = totalRunNumero[tamano - 1] - this.datos.sZamif.HFT.numFuegos[tamano - 1];
      this.dataNumeroFuegos.data[8][0] = this.diferenciaString;
      this.dataNumeroFuegos.data[8][tamano] = difcNumero.toFixed(2); // Diferencia

      // Porcetanje
      if (this.datos.sZamif.HFT.area[tamano - 1])
        this.dataHectareasQuemadas.data[9][tamano] = (difcArea / this.datos.sZamif.HFT.area[tamano - 1] * 100.0).toFixed(2);
      else
        this.dataHectareasQuemadas.data[9][tamano] = "-";

      if (this.datos.sZamif.HFT.numFuegos[tamano - 1]) {
        this.dataNumeroFuegos.data[9][tamano] = (difcNumero / this.datos.sZamif.HFT.numFuegos[tamano - 1] * 100.0).toFixed(2);
      }
      else {
        this.dataNumeroFuegos.data[9][tamano] = "-";
      }
    }

    // Columna Total Intensidad
    for (let intensidad = 1; intensidad <= 6; ++intensidad) {
      totalAreaInt += areaInt[intensidad - 1];
      totalNumeroInt += numeroInt[intensidad - 1];
      this.dataHectareasQuemadas.data[intensidad - 1][7] = areaInt[intensidad - 1].toFixed(2);
      this.dataNumeroFuegos.data[intensidad - 1][7] = numeroInt[intensidad - 1].toFixed(2);
    }

    this.dataHectareasQuemadas.data[6][7] = totalAreaInt.toFixed(2);
    this.dataNumeroFuegos.data[6][7] = totalNumeroInt.toFixed(2);

    this.dataHectareasQuemadas.data[7][7] = totalArea.toFixed(2);
    this.dataNumeroFuegos.data[7][7] = totalNumero.toFixed(2);

    const difcArea = totalAreaInt - totalArea;
    const difcNumero = totalNumeroInt - totalNumero;
    this.dataHectareasQuemadas.data[8][7] = difcArea.toFixed(2); // Difc
    this.dataNumeroFuegos.data[8][7] = difcNumero.toFixed(2); // Difc

    if (totalArea)
      this.dataHectareasQuemadas.data[9][7] = (difcArea / totalArea * 100.0).toFixed(2);
    else
      this.dataHectareasQuemadas.data[9][7] = "-";
    if (totalNumero)
      this.dataNumeroFuegos.data[9][7] = (difcNumero / totalNumero * 100.0).toFixed(2);
    else
      this.dataNumeroFuegos.data[9][7] = "-";


    this.dataSourceHectareasQuemadas = new MatTableDataSource<any>(this.dataHectareasQuemadas.data);
    this.dataSourceNumeroFuegos = new MatTableDataSource<any>(this.dataNumeroFuegos.data);
  }


  async calcula() {
    for (let index = 0; index < this.datos.sZamif.LR.length; index++) {
      const lr = this.datos.sZamif.LR[index];
      await this.calcularRunSize(lr);
    }
  }

  async calcularRunSize(lr: any) {
    if (lr.pct > 0) {
      for (let intensidad = 1; intensidad <= 6; ++intensidad) {
        let supEsc;
        let size = [0, 0];

        if (this.datos.sZamif.DCF.numFuegos[intensidad - 1] > 0) {
          for (let pctl = 0; pctl <= 1; ++pctl)
            if (this.datos.sZamif.DCF.velPropMaxXXpctl[pctl][intensidad - 1] > 0) {
              supEsc = lr.DCFLR.superficieEscXXpctl[pctl][intensidad - 1];
              let datosEjecucion = await this.datosEjecucionService.inicializaEjecuciones(this.datos.idOpcion.idOpcion, lr.IdLR, intensidad)
              if (datosEjecucion.length != 0)
                size[pctl] = this.datosEjecucionService.calculaDatosEjecucion(this.datos.sZamif, lr, supEsc, intensidad, this.datos.sZamif.DCF.velPropMaxXXpctl[pctl][intensidad - 1]);
            }
        }
        lr.runSize[0][intensidad - 1] = size[0];
        lr.runSize[1][intensidad - 1] = size[1];
      }
    }
  }

  rellenaCalculos() {
    for (let intensidad = 1; intensidad <= 6; intensidad++) {
      for (let tamano = 0; tamano < 6; ++tamano) {
        this.datos.sZamif.runHFT[intensidad - 1].numFuegos[tamano] = 0;
        this.datos.sZamif.runHFT[intensidad - 1].area[tamano] = 0;
      }
      this.datos.sZamif.runHFT[intensidad - 1].numFuegosTotal = 0;
    }

    this.datos.sZamif.LR.forEach(lr => {
      for (let intensidad = 1; intensidad <= 6; ++intensidad) {
        const baseRow = 2 + (intensidad - 1) * this.datos.zamif.lrs.length;
        for (let pctl = 0; pctl <= 1; ++pctl) {
          const size = lr.runSize[pctl][intensidad - 1];
          //GridST1->Floats[3+3*pctl][baseRow] = size; // Size50 Size90
          if (size > 0) {
            for (var tamano = 0; tamano < 5; ++tamano)
              if (size < Hectareas[tamano])
                break;
            const frac = [0.8, 0.2];
            const numFuegos = frac[pctl] * this.datos.sZamif.DCF.numFuegos[intensidad - 1] * lr.pct;
            this.datos.sZamif.runHFT[intensidad - 1].numFuegos[tamano] += numFuegos;
            this.datos.sZamif.runHFT[intensidad - 1].area[tamano] += numFuegos * size;
            this.datos.sZamif.runHFT[intensidad - 1].numFuegosTotal += numFuegos;
          }
        }
      }
    });

    this.necesitaCalcular = false;
  }

  cargarFuegosCalculados() {
    this.dataCalculado = [];
    for (let index = 0; index < this.dcfAll.length; index++) {
      const dcf = this.dcfAll[index];
      this.datos.zamif.lrs.forEach(lr => {
        const dcflr = this.dcflrAll.find(element => element.idLr.idLr == lr.idLr && element.intensidad == dcf.intensidad)

        this.dataCalculado.push({
          lugar: lr.lr,
          numeroFuegos: dcf.numFuegos,
          tamano50perc: dcflr.superficieEsc50pctl,
          tamano90perc: dcflr.superficieEsc90pctl,
          intensidad: dcf.intensidad, velocidad50perc: dcf.velPropMax50pctl,
          velocidad90perc: dcf.velPropMax90pctl,
          frec50perc: parseFloat((lr.pct * dcf.numFuegos * 0.8 / 100).toFixed(2)),
          frec90perc: parseFloat((lr.pct * dcf.numFuegos * 0.2 / 100).toFixed(2)),
        })
      })
    }
    this.dataSourceCalculado = new MatTableDataSource<DataCalculados>(this.dataCalculado);
  }

  async getDcflrList() {
    this.dcflrAll = [];
    this.dataEscapados = [];
    for (let index = 0; index < this.datos.sZamif.LR.length; index++) {
      const lr = this.datos.zamif.lrs[index];
      let items = await firstValueFrom(this.zonasService.getDcflrsByGfcdAndLr(this.datos.idGdcf.idGdcf, lr.idLr));
      this.dcflrAll = this.dcflrAll.concat(items);

      items.forEach(item => {
        const intensidad = item.intensidad;
        if (intensidad >= 1 && intensidad <= 6) {
          this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[0].push(item.superficieEsc50pctl);
          this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[1].push(item.superficieEsc90pctl);
        }
      });

      this.cargarEscapados(index, lr);

      this.necesitaCalcular = true;
    }
  }

  cargarEscapados(index: number, lr: Lr) {
    this.dataEscapados.push({
      lugar: lr, percentil: 50,
      intensidad1: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[0][0],
      intensidad2: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[0][1],
      intensidad3: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[0][2],
      intensidad4: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[0][3],
      intensidad5: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[0][4],
      intensidad6: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[0][5],
    })

    this.dataEscapados.push({
      lugar: lr, percentil: 90,
      intensidad1: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[1][0],
      intensidad2: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[1][1],
      intensidad3: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[1][2],
      intensidad4: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[1][3],
      intensidad5: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[1][4],
      intensidad6: this.datos.sZamif.LR[index].DCFLR.superficieEscXXpctl[1][5],
    })
  }


  async getDcfList() {
    this.dcfAll = [];
    let dcfList = await firstValueFrom(this.zonasService.getDcfByGfcdAndZamif(this.datos.idGdcf.idGdcf, this.datos.zamif.idZamif))
    this.dcfAll = dcfList;
    this.cargarDcf(dcfList);
  }

  cargarDcf(dcfList: Dcf[]) {
    for (let index = 0; index < dcfList.length; index++) {
      const dcf = dcfList[index];
      const intensidad = dcf.intensidad;
      if (intensidad >= 1 && intensidad <= 6) {
        this.datos.sZamif.DCF.numFuegos[intensidad - 1] = dcf.numFuegos;
        this.datos.sZamif.DCF.velPropMaxXXpctl[0][intensidad - 1] = dcf.velPropMax50pctl;
        this.datos.sZamif.DCF.velPropMaxXXpctl[1][intensidad - 1] = dcf.velPropMax90pctl;
      }
    }
  }

  async close() {
    let continuar = true;
    if (this.aviso) {

      const confirm = await this.uiService.confirmationAlert("Confirmación",
        "Hay cambios sin grabar. ¿Desea CONTINUAR y perder las modificaciones?");

      if (confirm) {
        continuar = true;
      } else {
        continuar = false;
      }
    }

    if (continuar) {
      this.appService.goPrev();
    }

  }

  async updateEscapados(dataEscapadosUpdated: DataEscapados[]) {
    this.aviso = true;
    this.dataEscapados = dataEscapadosUpdated;

    this.dcflrAll = [];
    let index = 0;
    // this.dataEscapados.length va a ser par siempre (LR - (percentil50 y percentil90)
    while (index < this.dataEscapados.length) {
      for (let i = 1; i <= 6; i++) {
        const superficie1 = this.dataEscapados[index]['intensidad' + i];
        const superficie2 = this.dataEscapados[index + 1]['intensidad' + i];
        const lr = this.dataEscapados[index].lugar;

        this.dcflrAll.push(new Dcflr(i, lr, this.datos.idGdcf, superficie1, superficie2));

        const indexLr = this.datos.sZamif.LR.findIndex(element => element.IdLR == lr.idLr)
        this.datos.sZamif.LR[indexLr].DCFLR.superficieEscXXpctl[0].push(superficie1);
        this.datos.sZamif.LR[indexLr].DCFLR.superficieEscXXpctl[1].push(superficie2);

        await this.calcula();
        this.rellenaCalculos();
        this.rellenaHistorico();
      }
      index = index + 2;
    }

    this.cargarFuegosCalculados();
  }

  updateDcf(dcfUpdated: Dcf[]) {
    this.aviso = true;
    this.dcfAll = dcfUpdated;
    this.cargarDcf(dcfUpdated);
    this.cargarFuegosCalculados();
  }

  updateSZamif(sZamif: sZAMIF) {
    this.aviso = true;
    this.datos.sZamif = sZamif;
  }

  saveData() {
    if (this.aviso) {
      // update dcf
      this.dcfAll.forEach(dcf => {
        this.zonasService.saveOrUpdatDcf(dcf).subscribe();
      })

      this.datos.sZamif.LR.forEach(async lr => {
        await firstValueFrom(this.zonasService.deleteDcflrByLr(lr.IdLR));
      })

      // update dcflr
      this.dcflrAll.forEach(dcflr => {
        this.zonasService.saveOrUpdatDcflr(dcflr).subscribe();
      })

      this.uiService.presentToast("Grabados los cambios en la base de datos");

      this.aviso = false;
    } else {
      this.uiService.presentToast("No hay cambios que grabar");
    }

  }

  async reload() {
    // si hay cambios sin guardar, aviso
    let continuar = true;
    if (this.aviso) {
      const confirm = await this.uiService.confirmationAlert("Confirmación",
        "Hay cambios sin grabar. ¿Desea CONTINUAR y perder las modificaciones?");

      if (confirm) {
        continuar = true;
      } else {
        continuar = false;
      }
    }
    if (continuar) {
      this.cargarData().then(() => {
        console.log("Datos cargados");
      });
    }
  }

}
