import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { CanComponentDeactivate } from 'src/app/services/can-deactivate-guard.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Bases } from 'src/entities/Bases';
import { Distancias } from 'src/entities/Distancias';
import { Lr } from 'src/entities/Lr';
import { ModelosCombustible } from 'src/entities/ModelosCombustible';
import { Zamif } from 'src/entities/Zamif';
import { ZonasService } from '../../services/zonas.service';
import { LrDataComponent } from '../lr-data/lr-data.component';


@Component({
  selector: 'zamif-data',
  templateUrl: './zamif-data.component.html',
  styleUrls: ['./zamif-data.component.scss'],
})
export class ZamifDataComponent extends TableClass implements OnInit, AfterViewInit, CanComponentDeactivate, IDataContainer {

  @Input() data: any;

  unSaved: boolean = true;

  modelosCombustibles: ModelosCombustible[] = [];
  selectedModel1: number;
  selectedModel2: number;
  selectedModel3: number;

  lugaresRepresenList: Lr[] = [];
  bases: Bases[] = [];
  lrDeleted: Lr[] = [];
  displayedColumns: string[] = ['select', 'lr', 'descripcion'];

  zamif: Zamif;

  @ViewChild(MatTable)
  table: MatTable<Lr>;

  buttons = {
    refComponent: this,
    buttons: []
  }

  cancelar = () => {
    this.appService.goPrev();
  }

  async guardar() {
    this.unSaved = false;

    this.zamif.modComb1 = this.selectedModel1;
    this.zamif.modComb2 = this.selectedModel2;
    this.zamif.modComb3 = this.selectedModel3;

    // save zamif => save lrs => save distancias

    this.zamif.lrs = undefined;
    let savedZamif = await firstValueFrom(this.zonasService.saveOrUpdateZamif(this.zamif));

    // borrar lrs de un zamif
    await firstValueFrom(this.zonasService.deleteLrByZamif(this.zamif.idZamif));

    for (let index = 0; index < this.lugaresRepresenList.length; index++) {
      const lr = this.lugaresRepresenList[index];

      let distancias = lr.distancias;
      let savedLr = await firstValueFrom(this.zonasService.saveOrUpdateLr(lr));

      // delete distancias asociadas a lr
      this.zonasService.deleteDistanciasByLr(savedLr.idLr).subscribe

      // insert distancias asociadas a lr
      if (distancias !== undefined) {
        distancias.forEach(distancia => {
          distancia.idLr = savedLr;
          this.zonasService.saveOrUpdateDistancias(distancia).subscribe();
        })
      }
    }

    this.uiService.presentToast("Mensaje guardado");

    this.appService.goPrev();
  }
  distancias: any;

  constructor(private appService: AppService, private zonasService: ZonasService, private uiService: UiService) {
    super();
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.unSaved) {

      const result = window.confirm('There are unsaved changes! Are you sure?');

      return of(result);
    }
    return true;
  };

  ngOnInit() {
    this.zamif = this.data.zamif;
    this.dataSource = new MatTableDataSource<any>([]);
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  ngAfterViewInit() {
    this.loadData();
  }

  isDisabled() {
    if (this.zamif.zamif === undefined || this.zamif.zamif === '') {
      return true;
    }

    if (this.zamif.descripcion === undefined || this.zamif.descripcion === '') {
      return true;
    }

    return false;

  }

  loadData() {
    if (this.data.lr !== undefined) {
      this.lugaresRepresenList = this.zamif.lrs === undefined ? [] : this.zamif.lrs;
      const index = this.lugaresRepresenList.findIndex(lr => lr.idLr === this.data.lr.idLr);

      if (index !== -1) {
        this.lugaresRepresenList[index] = this.data.lr;
      } else {
        this.lugaresRepresenList.push(this.data.lr);
      }
      this.dataSource.data = this.lugaresRepresenList;

      this.table.renderRows();
      this.isLoading = false;
    } else {
      this.zonasService.getLugaresRepresentativosByZamif(this.zamif.idZamif).subscribe(lrs => {
        this.lugaresRepresenList = lrs;
        this.dataSource.data = this.lugaresRepresenList;
        this.table.renderRows();
        this.isLoading = false;
      });
    }

    this.zonasService.getModelosCombustibles().subscribe(modelos => {
      this.modelosCombustibles = modelos
    });

    this.selectedModel1 = this.zamif.modComb1;
    this.selectedModel2 = this.zamif.modComb2;
    this.selectedModel3 = this.zamif.modComb3;
  }

  updateModelo1(value: number) {
    this.selectedModel1 = value;
    this.zamif.modComb1 = this.selectedModel1;
  }

  updateModelo2(value: number) {
    this.selectedModel2 = value;
    this.zamif.modComb2 = this.selectedModel1;
  }

  updateModelo3(value: number) {
    this.selectedModel3 = value;
    this.zamif.modComb3 = this.selectedModel1;
  }

  lastId() {
    if (this.lugaresRepresenList.length !== 0) {
      let length = this.lugaresRepresenList.length;
      return this.lugaresRepresenList[length - 1].idLr + 1;
    }
    return 1;
  }

  async open(element?: Lr) {
    if (await this.checkExistingData()) {
      let lr = element !== undefined ? element : new Lr(this.zamif);
      lr.idZamif = this.zamif;
      this.appService.loadComponent(new ContainerItem(LrDataComponent, {
        lr: lr,
        bases: this.bases,
        titleComponent: "Lugar representativo",
        isMainComponent: false,
        helpText: 'lrDataHelpText'
      }), this.appService.getRefCurrentDynamicComponent())
    } else {
      await this.uiService.avisoAlert("Aviso", "Antes de continuar debe añadir alguna ubicación (base) de los medios de combate", "medios-combate/1")
    }
  }

  async checkExistingData() {
    // Debe existir alguna base
    this.bases = await firstValueFrom(this.zonasService.getBasesList());
    if (this.bases.length === 0) {
      return false;
    } else {
      return true;
    }
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
      this.selection.selected.forEach(element => {
        const index = this.lugaresRepresenList.findIndex(lr => lr.idLr === element.idLr);
        this.lugaresRepresenList.splice(index, 1);
        this.dataSource.data = this.lugaresRepresenList;
        this.table.renderRows();
      })
    }
  }
}