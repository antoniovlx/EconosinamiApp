import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IonContent, IonSlides } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { RecursoDataComponent } from 'src/app/recursos-naturales/components/recursos/recurso-data/recurso-data.component';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { GruposComportamientoComponent } from 'src/app/zonas-analisis/components/comportamiento/components/grupos-comportamiento/grupos-comportamiento.component';
import { CostePromedioComponent } from 'src/app/zonas-analisis/components/coste-promedio/coste-promedio.component';
import { ZonasComponent } from 'src/app/zonas-analisis/components/zonas/components/zonas/zonas.component';
import { Dre } from 'src/entities/Dre';
import { Fdr } from 'src/entities/Fdr';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { FilosofiaDataComponent } from '../filosofia-data/filosofia-data.component';

@Component({
  selector: 'filosofia-recursos',
  templateUrl: './filosofia-recursos.component.html',
  styleUrls: ['./filosofia-recursos.component.scss'],
})
export class FilosofiaRecursosComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  data: any;

  filosofiasList: Fdr[];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];


  @ViewChild(MatTable) table: MatTable<RecursosForestales>;
  agrupaciones: Dre[];

  constructor(private appservice: AppService,
    private ejecucionService: EjecucionService, private mediosService: MediosService, private uiService: UiService) {
    super();
  }

  ngOnInit(): void {
    this.refreshData();
    this.appservice.setActionButtonsChanged$([]);
  }


  ngAfterViewInit(): void {

  }

  refreshData() {
    this.ejecucionService.getAllFdr()
      .subscribe(
        (items) => {
          this.filosofiasList = items;
          this.dataSource = new MatTableDataSource<Fdr>(this.filosofiasList);
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
    if (this.filosofiasList.length !== 0) {
      let length = this.filosofiasList.length;
      return this.filosofiasList[length - 1].idFdr + 1;
    }
    return 1;
  }

  async open(element?: Fdr) {
    const message = await this.checkExistingData();
    if (message === null) {
      let fdr = element !== undefined ? element : new Fdr(this.lastId() + 1);
      this.appservice.loadComponent(new ContainerItem(FilosofiaDataComponent, {
        fdr: fdr,
        agrupaciones: this.agrupaciones,
        titleComponent: "Asignación de tipos de medios a cada filosofía de despacho",
        helpText: 'filosofiaDataHelpText',
        isMainComponent: false
      }), this.appservice.getRefCurrentDynamicComponent())
    }
    else {
      await this.uiService.avisoAlert("Aviso", message, "medios-combate");
    }

  }

  async checkExistingData() {
    let datos = [];
    // deben existir agrupaciones de medios
    this.agrupaciones = await firstValueFrom(this.mediosService.getDreMedios());

    if (this.agrupaciones.length === 0) {
      datos.push("agrupaciones de medios");
    }

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
      this.selection.selected.forEach((element: Fdr) => {
        this.ejecucionService.deleteFdr(element).subscribe(result => {
          this.ejecucionService.deleteArfByFdr(element.idFdr).subscribe();
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

