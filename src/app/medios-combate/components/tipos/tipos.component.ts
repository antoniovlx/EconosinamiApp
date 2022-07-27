import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IDataContainer, AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Bases } from 'src/entities/Bases';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { MediosService } from '../../services/medios.service';
import { BaseDataComponent } from '../ubicaciones/base-data/base-data.component';
import { CategoriaMedioDataComponent } from './categoria-medio-data/categoria-medio-data.component';

@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.scss'],
})
export class TiposComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  data: any;

  static titleComponent: string = "Tipos de medios de combate";

  dataList: CategoriaMedios[];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];

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
    this.mediosService.getCategoriasMedios().subscribe((items) => {
      this.dataList = items;
      this.dataSource = new MatTableDataSource<CategoriaMedios>(this.dataList);
      this.elements = items.length;
      this.isLoading = false;
    });
  }

  lastId() {
    if (this.dataList.length !== 0) {
      let max = 1;
      this.dataList.forEach(element => {
        if (element.idCategoriaMedios > max) max = element.idCategoriaMedios;
      });
      return max + 1;
    }
    return 1;
  }

  open(element?: CategoriaMedios) {
    let categoria = element !== undefined ? element : new CategoriaMedios(this.lastId());
    this.appservice.loadComponent(new ContainerItem(CategoriaMedioDataComponent, {
      categoria: categoria,
      titleComponent: "Tipo de medio de combate",
      isMainComponent: false
    }), this.appservice.getRefCurrentDynamicComponent())
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
        this.mediosService.deleteCategoriaMedios(element).subscribe(result => {
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
