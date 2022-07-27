import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { DatosCalibracionComponent } from 'src/app/ejecucion/components/calibracion/ejecutar-calibracion/datos-calibracion/datos-calibracion.component';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { CnvrLr } from 'src/entities/CnvrLr';
import { GrupoCnvr } from 'src/entities/GrupoCnvr';
import { GrupoFustal } from 'src/entities/GrupoFustal';
import { GrupoLatizal } from 'src/entities/GrupoLatizal';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { Zamif } from 'src/entities/Zamif';
import { RecursosService } from '../../services/recursos.service';
import { CnvrLrDataComponent } from './cnvr-lr-data/cnvr-lr-data.component';
import { GrupoCnvrDataComponent } from './grupo-cnvr-data/grupo-cnvr-data.component';
import { GrupoMontebravo } from 'c:/Users/anton/git/econosinami-ionic/econosinami/src/entities/GrupoMontebravo';

@Component({
  selector: 'app-cambio-neto',
  templateUrl: './cambio-neto.component.html',
  styleUrls: ['./cambio-neto.component.scss'],
})
export class CambioNetoComponent extends TableClass implements OnInit {
  grupoCambioNetoList: GrupoCnvr[];
  zamifList: Zamif[];

  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];
  displayedColumnsZamif: string[] = ['codigo', 'descripcion'];

  isLoading1 = true;
  isLoading2 = true;
  recursos: RecursosForestales[];
  gruposFustal: GrupoFustal[];
  gruposLatizal: GrupoLatizal[];
  gruposMontebravo: GrupoMontebravo[];

  constructor(private recursosService: RecursosService, private zonasService: ZonasService,
    private appservice: AppService, private uiService: UiService, private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.refreshData();
    this.appservice.setActionButtonsChanged$([]);
  }

  refreshData() {
    this.recursosService.getGrupoCnvrList().subscribe((items) => {
      this.grupoCambioNetoList = items;
      this.dataSource = new MatTableDataSource<GrupoCnvr>(this.grupoCambioNetoList);
      this.isLoading1 = false;
    });

    this.zonasService.getZamifList();
    this.zonasService.getZamifLoaded$().subscribe((list) => {
      this.zamifList = list;
      this.isLoading2 = false;
    });

  }

  async open(element?: GrupoCnvr) {
    const message = await this.checkExistingDataRecursosZonas();
    if (message === null) {
      let grupo = element !== undefined ? element : new GrupoCnvr(this.lastId() + 1)
      this.appservice.loadComponent(new ContainerItem(GrupoCnvrDataComponent, {
        grupoCnvr: grupo,
        recursosForestales: this.recursos,
        gruposFustal: this.gruposFustal,
        gruposLatizal: this.gruposLatizal,
        gruposMontebravo: this.gruposMontebravo,
        titleComponent: "Cambio neto en el valor de los recursos",
        isMainComponent: false,
        helpText: 'cnvDataHelpText'
      }), this.appservice.getRefCurrentDynamicComponent())
    } else {
      await this.uiService.avisoAlert("Aviso", message, "recursos-naturales");
    }
  }

  async checkExistingDataRecursosZonas() {
    let datos = [];
    // Deben existir recursos y alguna zona de madera (fustal, latizal y montebravo)
    const recursos = await firstValueFrom(this.recursosService.getRecursosList());
    this.recursos = recursos;

    this.gruposFustal = await firstValueFrom(this.recursosService.getGruposFustalList());
    this.gruposLatizal = await firstValueFrom(this.recursosService.getGruposLatizalList());
    this.gruposMontebravo = await firstValueFrom(this.recursosService.getGruposMontebravoList());

    if (this.recursos.length === 0) {
      datos.push("Recursos naturales")
    }

    if (this.gruposFustal.length === 0 && this.gruposLatizal.length === 0 && this.gruposMontebravo.length === 0) {
      datos.push("Zonas de madera");
    }

    if (datos.length === 0)
      return null;

    return this.uiService.createMessageAviso(datos);
  }

  async openZamif(element?: Zamif) {
    const message = await this.checkExistingDataLrGruposCnvr(element);
    if (message === null) {
      let zamif = element !== undefined ? element : new GrupoCnvr(this.lastId() + 1)
      this.appservice.loadComponent(new ContainerItem(CnvrLrDataComponent, {
        zamif: zamif,
        gruposCnvr: this.grupoCambioNetoList,
        titleComponent: "Asignación de Grupos de CNVR a lugares representativos",
        isMainComponent: false,
        helpText: 'asignacionCnvrLrHelpText'
      }), this.appservice.getRefCurrentDynamicComponent())
    } else {
      await this.uiService.avisoAlert("Aviso", message, "recursos-naturales");
    }
  }

  async checkExistingDataLrGruposCnvr(zamif: Zamif) {
    let datos = [];
    // Deben existir lr en el zamif seleccionado y grupos de cambio neto en el valor de los recursos
    const lrs = zamif.lrs;
    if (lrs.length === 0) {
      const message = await firstValueFrom(this.translate.get("lugares representativos en el Zamif"))
      datos.push(message + ": (" + zamif.zamif + ") " + zamif.descripcion);
    }

    if (this.grupoCambioNetoList.length === 0) {
      datos.push("Grupos de cambio neto en el valor de los recursos");
    }

    if (datos.length === 0)
      return null;

    return this.uiService.createMessageAviso(datos);
  }


  lastId() {
    if (this.grupoCambioNetoList.length !== 0) {
      let length = this.grupoCambioNetoList.length;
      return this.grupoCambioNetoList[length - 1].idGrupoCnvr + 1;
    }
    return 1;
  }


  async delete() {
    let continuar = true;

    const confirm = await this.uiService.confirmationAlert("Confirmación",
      "¿Desea CONTINUAR y eliminar los elementos seleccionados?");

    if (confirm) {
      continuar = true;
    } else {
      continuar = false;
    }

    if (continuar) {
      const selectedLen = this.selection.selected.length;
      let count = 0;
      this.selection.selected.forEach((element: GrupoCnvr) => {
        this.recursosService.deleteGrupoCnvr(element).subscribe(result => {

          // delete CNVR y CNVR_LR asociados
          this.recursosService.deleteCnvrByGrupoCnvr(element.idGrupoCnvr).subscribe();
          this.recursosService.deleteCnvrLrByGrupoCnvr(element.idGrupoCnvr).subscribe();

          count++
          if (count === selectedLen) {
            this.uiService.presentToast("Mensaje borrado");
            this.refreshData();
          }
        })
      });
    }
  }
}

