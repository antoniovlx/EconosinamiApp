import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { IDataContainer, AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Bases } from 'src/entities/Bases';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { Dre } from 'src/entities/Dre';
import { GrupoMedios } from 'src/entities/GrupoMedios';
import { RatiosProduccion } from 'src/entities/RatiosProduccion';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { MediosService } from '../../services/medios.service';
import { BaseDataComponent } from '../ubicaciones/base-data/base-data.component';
import { GrupoMedioDataComponent } from './grupo-medio-data/grupo-medio-data.component';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss'],
})
export class GruposComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  data: any;

  static titleComponent: string = "Grupos de medios de combate";

  gruposMediosList: GrupoMedios[];

  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];
  categorias: CategoriaMedios[];
  agrupaciones: Dre[];

  constructor(private appservice: AppService, private mediosService: MediosService, private uiService: UiService) {
    super();
  }

  ngOnInit(): void {
    this.refreshData();
    this.appservice.setActionButtonsChanged$([]);
  }

  ngAfterViewInit(): void {

  }


  refreshData() {
    this.mediosService.getGruposMedios().subscribe((items) => {
      this.gruposMediosList = items;
      this.dataSource = new MatTableDataSource<GrupoMedios>(this.gruposMediosList);
      this.elements = items.length;
      this.isLoading = false;
    });
  }

  lastIdGrupo() {
    if (this.gruposMediosList.length !== 0) {
      let max = 1;
      this.gruposMediosList.forEach(element => {
        if (element.idGrupoMedios > max) max = element.idGrupoMedios;
      });
      return max + 1;
    }
    return 1;
  }

  async open(element?: GrupoMedios) {
    const message = await this.checkExistingData();
    if (message === null) {
      let grupo = element !== undefined ? element : new GrupoMedios(this.lastIdGrupo());
      this.appservice.loadComponent(new ContainerItem(GrupoMedioDataComponent, {
        grupo: grupo,
        categorias: this.categorias,
        agrupaciones: this.agrupaciones,
        titleComponent: "Definición de grupo de medios de combate",
        isMainComponent: false,
        helpText: 'grupoMedioDataHelpText'
      }), this.appservice.getRefCurrentDynamicComponent())
    } else {
      await this.uiService.avisoAlert("Aviso", message, "medios-combate");
    }
  }

  async checkExistingData() {
    let datos = [];

    // deben existir agrupaciones de medios y tipos de medios
    this.categorias = await firstValueFrom(this.mediosService.getCategoriasMedios());
    this.agrupaciones = await firstValueFrom(this.mediosService.getDreMedios());

    if (this.categorias.length === 0)
      datos.push("Tipos de medios");

    if (this.agrupaciones.length === 0)
      datos.push("Agrupaciones de medios");

    if(datos.length === 0)
      return null;

    return this.uiService.createMessageAviso(datos);
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
      this.selection.selected.forEach((element: GrupoMedios) => {
        this.mediosService.deleteGruposMedios(element).subscribe(result => {

          this.mediosService.deleteRatiosMediosByGrupoMedio(element.idGrupoMedios).subscribe();

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
