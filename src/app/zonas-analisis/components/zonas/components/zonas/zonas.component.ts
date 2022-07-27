import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { Zamif } from 'src/entities/Zamif';
import { ZonasService } from '../../services/zonas.service';
import { ZamifDataComponent } from '../zamif-data/zamif-data.component';
import { TableClass } from 'src/app/shared/tableClass';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss'],
})
export class ZonasComponent extends TableClass implements OnInit, IDataContainer {

  zamifList: Zamif[] = [];
  @ViewChild("table", { static: false }) table: MatTable<Zamif>;

  displayedColumns: string[] = ['select', 'zamif', 'descripcion'];

  constructor(private appservice: AppService, private zonasService: ZonasService, private uiService: UiService) {
    super();
  }

  @Input()
  data: any;

  ngOnInit() {
    this.appservice.setActionButtonsChanged$([]);
    this.refreshData();
  }

  refreshData() {
    this.zonasService.getZamifList();

    this.zonasService.getZamifLoaded$().subscribe(zamifList => {
      if(zamifList.length === 0){
        this.zonasService.setZonasAnalisisCompleted$(false);
      }
      
      this.zamifList = zamifList;
      this.dataSource = new MatTableDataSource<any>(this.zamifList);
      this.elements = this.zamifList.length;
      this.isLoading = false;
    });
  }


  lastId() {
    if (this.dataSource.data.length !== 0) {
      let length = this.dataSource.data.length;
      return this.dataSource.data[length - 1].idZamif + 1;
    }
    return 1;
  }

  open(element?: Zamif) {
    let zamif = element !== undefined ? element : new Zamif(this.lastId() + 1);
    this.appservice.loadComponent(new ContainerItem(ZamifDataComponent, {
      zamif: zamif,
      titleComponent: "Zona de análisis de manejo de incendios forestales",
      isMainComponent: false,
      helpText: 'zamifDataHelpText'
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
      this.selection.selected.forEach((element: Zamif) => {
        this.zonasService.deleteZamif(element).subscribe(result => {
          this.zonasService.deleteDcfByZamif(element.idZamif).subscribe();
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
