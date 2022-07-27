import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Especie } from 'src/entities/Especies';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { RecursosService } from '../../services/recursos.service';
import { EspecieDataComponent } from '../especies/especie-data/especie-data.component';
import { RecursoDataComponent } from './recurso-data/recurso-data.component';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss'],
})
export class RecursosComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  data: any;

  recursosList: RecursosForestales[];
  displayedColumns: string[] = ['select', 'denominacion', 'unidad'];


  @ViewChild(MatTable) table: MatTable<RecursosForestales>;

  constructor(private appservice: AppService, private recursosService: RecursosService, private uiService: UiService) {
    super();
  }

  ngOnInit(): void {
    this.appservice.setActionButtonsChanged$([]);
    this.refreshData();
  }


  ngAfterViewInit(): void {

  }

  refreshData() {
    this.recursosService.getRecursosList().subscribe((items) => {
      this.recursosList = items;
      this.dataSource = new MatTableDataSource<RecursosForestales>(this.recursosList);
      this.elements = items.length;
      this.isLoading = false;
      //this.dataSource.data = this.recursosList;
      //this.table.renderRows();
    });
  }

  lastId() {
    if (this.dataSource.data.length !== 0) {
      let length = this.dataSource.data.length;
      return this.dataSource.data[length - 1].idRecursoForestal + 1;
    }
    return 1;
  }

  open(element?: RecursosForestales) {
    let recurso = element !== undefined ? element : new RecursosForestales(this.lastId() + 1);
    recurso.tipo = '';
    this.appservice.loadComponent(new ContainerItem(RecursoDataComponent, {
      recurso: recurso,
      titleComponent: "Datos de recursos forestales",
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
      this.selection.selected.forEach((element: RecursosForestales) => {
        this.recursosService.deleteRecursos(element).subscribe(result => {
          // borrar entradas en cnvr
          this.recursosService.deleteCnvrByRecurso(element.idRecursoForestal).subscribe();

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
