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
import { Medios } from 'src/entities/Medios';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { MediosService } from '../../services/medios.service';
import { BaseDataComponent } from '../ubicaciones/base-data/base-data.component';
import { MedioDataComponent } from './medio-data/medio-data.component';

@Component({
  selector: 'app-definicion',
  templateUrl: './definicion.component.html',
  styleUrls: ['./definicion.component.scss'],
})
export class DefinicionComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  data: any;

  static titleComponent: string = "Definición de medios de combate";

  dataList: Medios[];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion', 'base'];
  grupoMedios: GrupoMedios[];
  categorias: CategoriaMedios[];
  agrupaciones: Dre[];
  bases: Bases[];

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
    this.mediosService.getMedios().subscribe((items) => {
      this.dataList = items;
      this.dataSource = new MatTableDataSource<Medios>(this.dataList);
      this.elements = items.length;
      this.isLoading = false;
    });
  }

  lastId() {
    if (this.dataList.length !== 0) {
      let length = this.dataList.length;
      return this.dataList[length - 1].idMedio + 1;
    }
    return 1;
  }

  async open(element?: Medios) {
    const message = await this.checkExistingData();
    if (message ===  null) {
      let medio = element !== undefined ? element : new Medios(this.lastId());
      this.appservice.loadComponent(new ContainerItem(MedioDataComponent, {
        medio: medio,
        grupoMedios: this.grupoMedios,
        categoriasMedios: this.categorias,
        agrupacionesMedios: this.agrupaciones,
        bases: this.bases,
        titleComponent: "Medio de combate",
        isMainComponent: false
      }), this.appservice.getRefCurrentDynamicComponent())
    } else {
      await this.uiService.avisoAlert("Aviso", message, "medios-combate");
    }
  }

  async checkExistingData() {
    let datos = [];

    // deben existir grupos de medios, tipo de medios, agrupaciones de medios bases
    this.grupoMedios = await firstValueFrom(this.mediosService.getGruposMedios());
    this.categorias = await firstValueFrom(this.mediosService.getCategoriasMedios());
    this.agrupaciones = await firstValueFrom(this.mediosService.getDreMedios());
    this.bases = await (firstValueFrom(this.mediosService.getBases()));

    if (this.grupoMedios.length === 0)
      datos.push("Grupos de medios");

    if (this.categorias.length === 0)
      datos.push("Tipos de medios"); 

    if (this.agrupaciones.length === 0)
      datos.push("Agrupaciones de medios");

    if (this.bases.length === 0)
      datos.push("Ubicaciones (bases) de medios");


    if (datos.length === 0)
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
      this.selection.selected.forEach(element => {
        this.mediosService.deleteMedios(element).subscribe(result => {
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
