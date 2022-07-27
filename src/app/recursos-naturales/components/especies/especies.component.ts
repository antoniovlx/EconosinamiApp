import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Especie } from 'src/entities/Especies';
import { RecursosService } from '../../services/recursos.service';
import { EspecieDataComponent } from './especie-data/especie-data.component';

@Component({
  selector: 'app-especies',
  templateUrl: './especies.component.html',
  styleUrls: ['./especies.component.scss'],
})
export class EspeciesComponent extends TableClass implements OnInit, IDataContainer {

  static titleComponent: string = "Definición de especies";

  data: any;

  especieList: Especie[];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];

  @ViewChild("table", { static: false }) table: ElementRef;

  constructor(private appservice: AppService, private recursosService: RecursosService, public uiService: UiService) {
    super();
  }

  ngOnInit() {
    this.appservice.setActionButtonsChanged$([]);
    this.refreshData();
  }

  refreshData() {
    this.recursosService.getEspeciesList().subscribe((items) => {
      this.especieList = items;
      //this.appservice.especiesListUpdated(this.especieList);
      this.dataSource = new MatTableDataSource<Especie>(this.especieList);
      this.elements = items.length;
      this.isLoading = false;
    });
  }

  lastId() {
    if (this.dataSource.data.length !== 0) {
      let length = this.dataSource.data.length;
      return this.dataSource.data[length - 1].idEspecie + 1;
    }
    return 1;
  }

  open(element?: Especie) {
    let especie = element !== undefined ? element : new Especie(this.lastId() + 1);
    this.appservice.loadComponent(new ContainerItem(EspecieDataComponent, {
      especie: especie,
      titleComponent: "Datos de especies",
      isMainComponent: false,
      helpText: 'especiesDataHelpText'
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
      this.selection.selected.forEach((element: Especie) => {
        count++
        this.recursosService.deleteEspecie(element).subscribe(result => {
          // borrar latizal, montebravo, y fustal por especie
          this.recursosService.deleteFustalByEspecie(element.idEspecie).subscribe();
          this.recursosService.deleteLatizalByEspecie(element.idEspecie).subscribe();
          this.recursosService.deleteMontebravoByEspecie(element.idEspecie).subscribe();

          if (count === selectedLen) {
            this.uiService.presentToast("Mensaje borrado");
            this.refreshData();
          }
        })
      });
    }
  }
}
