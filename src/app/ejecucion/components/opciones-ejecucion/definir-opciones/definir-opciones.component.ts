import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { ZamifDataComponent } from 'src/app/zonas-analisis/components/zonas/components/zamif-data/zamif-data.component';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { Fdr } from 'src/entities/Fdr';
import { GruposEjecucion } from 'src/entities/GruposEjecucion';
import { Opciones } from 'src/entities/Opciones';
import { Zamif } from 'src/entities/Zamif';
import { OpcionesDataComponent } from '../opciones-data/opciones-data.component';

@Component({
  selector: 'definir-opciones',
  templateUrl: './definir-opciones.component.html',
  styleUrls: ['./definir-opciones.component.scss'],
})
export class DefinirOpcionesComponent extends TableClass implements OnInit {
  opcionesList: Opciones[];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];
  zamifList: Zamif[];
  gruposEjecucion: GruposEjecucion[];
  filosofiasList: Fdr[];


  constructor(private appService: AppService, private ejecucionService: EjecucionService,
    private zonasService: ZonasService, private translate: TranslateService,
    private uiService: UiService) {
    super();
  }

  ngOnInit() {
    this.refreshData();
    this.appService.setActionButtonsChanged$([]);
  }

  refreshData() {
    this.ejecucionService.getAllOpcionesEjecucion()
      .subscribe(
        (items) => {
          this.opcionesList = items;
          this.dataSource = new MatTableDataSource<Opciones>(this.opcionesList);
        },
        error => {
          console.log(error)
        }
      );
  }

  lastId() {
    if (this.dataSource.data.length !== 0) {
      let length = this.dataSource.data.length;
      return this.dataSource.data[length - 1].idZamif + 1;
    }
    return 1;
  }

  async open(element?: Opciones) {
    const message = await this.checkExistingData();
    if (message === null) {
      // {opcion: Opciones, fdrlrList: Fdrlr[], fdrlrListRemove: Fdrlr[]}
      if (element === undefined) {
        element = new Opciones(this.lastId());
        element.idGrupoEjecucion = new GruposEjecucion();
        element.idFdr = new Fdr();
        element.fdrlrs = [];
      }
      this.appService.loadComponent(new ContainerItem(OpcionesDataComponent, {
        opcion: element,
        zamifList: this.zamifList,
        gruposEjecucion: this.gruposEjecucion,
        filosofiasList: this.filosofiasList,
        titleComponent: "Opciones de ejecución",
        isMainComponent: false
      }), this.appService.getRefCurrentDynamicComponent())
    } else {
      await this.uiService.avisoAlert("Aviso", message);
    }
  }

  async checkExistingData() {
    // deben existir grupos de ejecución, filosofia de despacho de recursos, zamif y lr para cada zamif

    let datos = []
    
    this.zamifList = await firstValueFrom(this.zonasService.getAllZamif());
    this.gruposEjecucion = await firstValueFrom(this.ejecucionService.getAllGruposEjecucion());
    this.filosofiasList = await firstValueFrom(this.ejecucionService.getAllFdr());

  
    if (this.zamifList.length === 0) {
      datos.push("Zonas de análisis")
    } else {
      const message = await firstValueFrom(this.translate.get("lugares representativos en el Zamif"))
      for (let index = 0; index < this.zamifList.length; index++) {
        const zamif = this.zamifList[index];
       
        if (zamif.lrs.length === 0) {
          datos.push(message + ": (" + zamif.zamif + ") " + zamif.descripcion);
        }
      }
    }

    if (this.gruposEjecucion.length === 0){
      datos.push("Grupos de ejecución")
    }
      
    if (this.filosofiasList.length === 0){
      datos.push("Filosofias de despacho")
    }  

    if(datos.length === 0){
      return null;
    }

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
        this.ejecucionService.deleteOpcionesEjecucion(element).subscribe(result => {
          count++
          if (count === selectedLen) {
            this.uiService.presentToast("Mensaje borrado");
            this.refreshData();
          }
        })
      });
      this.ejecucionService.getOpcionesChanged$().next([]);
    }
  }
}
