import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Dre } from 'src/entities/Dre';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { MediosService } from '../../services/medios.service';
import { DreMedioDataComponent } from './dre-medio-data/dre-medio-data.component';

@Component({
  selector: 'app-agrupaciones',
  templateUrl: './agrupaciones.component.html',
  styleUrls: ['./agrupaciones.component.scss'],
})
export class AgrupacionesComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  data: any;

  static titleComponent: string = "Agrupaciones para el envío de medios";

  dataList: Dre[];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];

  constructor(private appservice: AppService, private mediosService: MediosService, 
    private uiService: UiService, private ejecucionService: EjecucionService) {
    super();
  }

  ngOnInit(): void {
    this.refreshData();
    this.appservice.setActionButtonsChanged$([]);
  }


  ngAfterViewInit(): void {

  }

  refreshData() {
    this.mediosService.getDreMedios().subscribe((items) => {
      this.dataList = items;
      this.dataSource = new MatTableDataSource<Dre>(this.dataList);
      this.elements = items.length;
      this.isLoading = false;
    });
  }

  lastId() {
    if (this.dataList.length !== 0) {
      let max = 1;
      this.dataList.forEach(element => {
        if (element.idDre > max) max = element.idDre;
      });
      return max + 1;
    }
    return 1;
  }

  open(element?: Dre) {
    let dre = element !== undefined ? element : new Dre(this.lastId());
    this.appservice.loadComponent(new ContainerItem(DreMedioDataComponent, {
      dre: dre,
      titleComponent: "Agrupación para el envío de medios",
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
      this.selection.selected.forEach((element: Dre) => {
        this.mediosService.deleteDreMedios(element).subscribe(result => {
          this.ejecucionService.deleteArfByDre(element.idDre).subscribe();
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
