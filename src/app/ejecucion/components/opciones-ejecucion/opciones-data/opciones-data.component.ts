import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { Arf } from 'src/entities/Arf';
import { Fdr } from 'src/entities/Fdr';
import { Fdrlr } from 'src/entities/Fdrlr';
import { GruposEjecucion } from 'src/entities/GruposEjecucion';
import { Lr } from 'src/entities/Lr';
import { Opciones } from 'src/entities/Opciones';
import { Zamif } from 'src/entities/Zamif';

class DataTable {

  constructor(zamif, lr, filosofia) {
    this.zamif = zamif
    this.lr = lr
    this.filosofia = filosofia
  }

  idFdlr: number
  zamif: string
  lr: Lr
  filosofia: Fdr
}

interface ZamifLrNode {
  idZamif?: number;
  idLr?: number;
  nombre?: string;
  filosofia?: number;
  idFdlr?: number;
  children?: ZamifLrNode[];
  countLr?: number;
}

interface ExampleFlatNode {
  expandable: boolean;
  nombre: string;
  filosofia?: number;
  level: number;
}


@Component({
  selector: 'app-opciones-data',
  templateUrl: './opciones-data.component.html',
  styleUrls: ['./opciones-data.component.scss'],
})
export class OpcionesDataComponent implements OnInit, IDataContainer {

  @Input()
  data: any;

  opcion: Opciones;

  treeData: ZamifLrNode[] = [];


  selectedGrupoEjecucion: number;
  selectedFilosofia: number

  zamifList: Zamif[];
  fdrlrList: Fdrlr[];
  fdrlrListRemove: Fdrlr[] = [];
  gruposEjecucion: GruposEjecucion[];
  filosofias: Fdr[] = [];

  displayedColumns: string[] = ['zamif-lr', 'filosofia'];

  dataTable: DataTable[] = []
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }


  private transformer = (node: ZamifLrNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      idZamif: node.idZamif,
      idLr: node.idLr,
      idFdlr: node.idFdlr,
      nombre: node.nombre,
      filosofia: node.filosofia,
      countLr: node.countLr,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(private appService: AppService,
    private zonasService: ZonasService, private ejecucionService: EjecucionService,
    private uiService: UiService, public utilService: UtilService) {

  }

  ngOnInit() {
    this.opcion = this.data.opcion;

    this.selectedFilosofia = this.opcion.idFdr !== null ? this.opcion.idFdr.idFdr : 0;
    this.selectedGrupoEjecucion = this.opcion.idGrupoEjecucion !== null ? this.opcion.idGrupoEjecucion.idGrupoEjecucion : 0;

    if (this.opcion.idFdr == null) {
      this.opcion.idFdr = new Fdr(null);
    }

    this.gruposEjecucion = this.data.gruposEjecucion;
    this.filosofias = this.data.filosofiasList;


    this.getZamifData();

    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "close", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "confirm", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  /**
   * <button mat-button (click)="close()">
      <mat-icon class="red-icon">close</mat-icon>{{'Cancelar' | translate}}
    </button>
    <button mat-button cdkFocusInitial (click)="confirm()" [disabled]="codigo.value === '' ||
    descripcion.value === '' || grupo.value === undefined || presupuesto.value === undefined || filosofia.value === undefined">
      <mat-icon class="green-icon">done</mat-icon>{{'Guardar' | translate}}
    </button>
   */

  isDisabled() {
    if (this.opcion.opcion === undefined || this.opcion.opcion === '') {
      return true;
    }

    if (this.opcion.descripcion === undefined || this.opcion.descripcion === '') {
      return true;
    }

    if (this.opcion.descripcion === undefined || this.opcion.descripcion === '') {
      return true;
    }

    if (this.selectedFilosofia === undefined || this.selectedFilosofia === null) {
      return true;
    }

    if ( this.selectedGrupoEjecucion === undefined ||  this.selectedGrupoEjecucion === null) {
      return true;
    }

    return false;
  }


  private getZamifData() {
    this.zamifList = this.data.zamifList;
    this.ejecucionService.getAllFdrlrByOpcion(this.opcion.idOpcion).subscribe(fdrlr => {
      this.fdrlrList = fdrlr;
      //this.data.fdrlrs = this.fdrlrList;
      this.zamifList.forEach(zamif => {
        let zamifLr: ZamifLrNode[] = [];
        for (let index = 0; index < zamif.lrs.length; index++) {
          const lr = zamif.lrs[index]; // lr
          var tituloZamif = zamif.zamif + ' ' + zamif.descripcion;
          //var tituloLr = lr.lr + ' ' + lr.descripcion
          var fdrlr = this.fdrlrList.find(value => value.idLr.idLr === lr.idLr);
          var data = new DataTable(tituloZamif, lr, new Fdr(0));
          if (fdrlr != undefined) {
            data.idFdlr = fdrlr.idFdrlr;
            data.filosofia = fdrlr.idFdr;
          }

          this.dataTable.push(data);

          zamifLr.push({ idZamif: zamif.idZamif, idLr: lr.idLr, nombre: "(" + data.lr.lr + ") " + data.lr.descripcion, idFdlr: data.idFdlr, filosofia: data.filosofia.idFdr });
        }

        this.treeData.push({
          nombre: data.zamif,
          children: zamifLr,
          countLr: zamifLr.length
        });

        this.dataSource.data = this.treeData;

        if (this.treeControl.dataNodes.length >= 1) {
          this.treeControl.expand(this.treeControl.dataNodes[0]);
        }
      });
    });
  }

  onChangeFilosofiaLr(selected, element: ZamifLrNode) {
    let filosofia = this.filosofias.find(filosofia => filosofia.idFdr === selected)

    let index = this.dataTable.findIndex(data => data.lr.idLr == element.idLr)
    if (filosofia === undefined) {
      this.dataTable[index].filosofia.idFdr = undefined;
    } else {
      this.dataTable[index].filosofia = filosofia;
    }
  }

  updateGrupoSelected(event) {
    this.selectedGrupoEjecucion = event.detail.value;
    this.setButtons();
  }

  updateFilosofiaSelected(event) {
    this.selectedFilosofia = event.detail.value;
    this.setButtons();
  }

  close() {
    this.appService.goPrev();
  }

  confirm() {
    this.unSaved = false;

    this.processData();
    this.ejecucionService.deleteFdrlrByOpcion(this.opcion).subscribe();
    this.ejecucionService.saveOrUpdateOpciones(this.opcion).subscribe(() => {
      this.ejecucionService.getOpcionesChanged$().next([]);
      // delete all fdrlr
      this.ejecucionService.deleteFdrlrByOpcion(this.opcion).subscribe(() => {
        // insert all fdrlr
        this.fdrlrList.forEach(fdrlr => {
          this.ejecucionService.saveOrUpdateFdrlr(fdrlr).subscribe();
        })
      });
    });

    this.uiService.presentToast("Mensaje guardado");
    this.appService.goPrev();
  }

  processData() {
    this.opcion.idFdr = this.filosofias.find(filosofia => filosofia.idFdr === this.selectedFilosofia);
    this.opcion.idGrupoEjecucion = this.gruposEjecucion.find(grupo => grupo.idGrupoEjecucion === this.selectedGrupoEjecucion);

    for (let index = 0; index < this.dataTable.length; index++) {
      const element = this.dataTable[index];
      const indexFdrlr = this.fdrlrList.findIndex(fdrlr => element.idFdlr != undefined && fdrlr.idFdrlr == element.idFdlr);

      if (indexFdrlr !== -1) {
        if (element.filosofia.idFdr != undefined) {
          // actualizar
          this.fdrlrList[indexFdrlr].idLr = element.lr;
          this.fdrlrList[indexFdrlr].idFdr = element.filosofia;
          this.fdrlrList[indexFdrlr].idOpcion = this.opcion;
        } else {
          // borrar
          this.fdrlrList.splice(indexFdrlr, 1);
        }
      } else {
        if (element.filosofia.idFdr != 0) {
          // añadir
          let fdrlr = new Fdrlr();
          fdrlr.idLr = element.lr;
          fdrlr.idFdr = element.filosofia;
          fdrlr.idOpcion = this.opcion;
          this.fdrlrList.push(fdrlr)
        }
      }
    }
  }
}
