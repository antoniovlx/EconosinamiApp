import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RecursoDataComponent } from 'src/app/recursos-naturales/components/recursos/recurso-data/recurso-data.component';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { IDataContainer, AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Bases } from 'src/entities/Bases';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { MediosService } from '../../services/medios.service';
import { BaseDataComponent } from './base-data/base-data.component';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.scss'],
})
export class UbicacionesComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  static titleComponent: string = "Definición de ubicaciones de las bases"

  data: any;

  basesList: Bases[] = [];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];
  elements: number = 0;

  @ViewChild(MatTable) table: MatTable<RecursosForestales>;

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
    this.mediosService.getBases().subscribe((items) => {
      this.basesList = items;
      this.dataSource = new MatTableDataSource<Bases>(this.basesList);
      this.elements = items.length;
      this.isLoading = false;
    });
  }

  lastId() {
    if (this.basesList.length !== 0) {
      let length = this.basesList.length;
      return this.basesList[length - 1].idBase + 1;
    }
    return 1;
  }

  open(element?: Bases) {
    let base = element !== undefined ? element : new Bases(this.lastId());
    this.appservice.loadComponent(new ContainerItem(BaseDataComponent, {
      base: base,
      titleComponent: "Definición de ubicaciones de las bases",
      isMainComponent: false,
      helpText: 'basesDataHelpText',
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
        this.mediosService.deleteDistanciaByBase(element.idBase).subscribe();

        this.mediosService.deleteBases(element).subscribe(result => {
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