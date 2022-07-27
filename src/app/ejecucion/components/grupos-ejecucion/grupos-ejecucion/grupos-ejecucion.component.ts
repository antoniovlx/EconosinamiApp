import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { RecursoDataComponent } from 'src/app/recursos-naturales/components/recursos/recurso-data/recurso-data.component';
import { IDataContainer, AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Fdr } from 'src/entities/Fdr';
import { GruposEjecucion } from 'src/entities/GruposEjecucion';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { GruposEjecucionDataComponent } from '../grupos-ejecucion-data/grupos-ejecucion-data.component';

@Component({
  selector: 'app-grupos-ejecucion',
  templateUrl: './grupos-ejecucion.component.html',
  styleUrls: ['./grupos-ejecucion.component.scss'],
})
export class GruposEjecucionComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  data: any;

  gruposEjecucionList: GruposEjecucion[];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];

  @ViewChild(MatTable) table: MatTable<RecursosForestales>;

  constructor(private appservice: AppService, private ejecucionService: EjecucionService, private uiService: UiService) {
    super();
  }

  ngOnInit(): void {
    this.refreshData();
    this.appservice.setActionButtonsChanged$([]);
  }


  ngAfterViewInit(): void {

  }

  refreshData() {
    this.ejecucionService.getAllGruposEjecucion()
      .subscribe(
        (items) => {
          this.gruposEjecucionList = items;
          this.dataSource = new MatTableDataSource<GruposEjecucion>(this.gruposEjecucionList);
          this.isLoading = false;
        },
        error => {
          console.log(error)
        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      );
  }


  lastId() {
    if (this.gruposEjecucionList.length !== 0) {
      let length = this.gruposEjecucionList.length;
      return this.gruposEjecucionList[length - 1].idGrupoEjecucion + 1;
    }
    return 1;
  }

  open(element?: GruposEjecucion) {
    let grupoEjecucion = element !== undefined ? element : new GruposEjecucion(this.lastId());
    this.appservice.loadComponent(new ContainerItem(GruposEjecucionDataComponent, {
      grupoEjecucion: grupoEjecucion,
      titleComponent: "Definición de grupo de ejecución",
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
        this.ejecucionService.deleteGrupoEjecucion(element).subscribe(result => {
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


