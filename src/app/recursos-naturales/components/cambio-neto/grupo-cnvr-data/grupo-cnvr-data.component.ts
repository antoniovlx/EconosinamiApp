import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Cnvr } from 'src/entities/Cnvr';
import { GrupoCnvr } from 'src/entities/GrupoCnvr';
import { GrupoFustal } from 'src/entities/GrupoFustal';
import { GrupoLatizal } from 'src/entities/GrupoLatizal';
import { GrupoMontebravo } from 'src/entities/GrupoMontebravo';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { CnvrDataComponent } from '../cnvr-data/cnvr-data.component';
import { CnvrLrDataComponent } from '../cnvr-lr-data/cnvr-lr-data.component';

@Component({
  selector: 'agrupo-cnv-data',
  templateUrl: './grupo-cnvr-data.component.html',
  styleUrls: ['./grupo-cnvr-data.component.scss'],
})
export class GrupoCnvrDataComponent extends TableClass implements OnInit, IDataContainer {
  @Input()
  data: any;

  grupoCnvr: GrupoCnvr;
  cnvrsList: Cnvr[] = [];
  recursosForestales: RecursosForestales[] = [];

  displayedColumns: string[] = ['recurso', 'hectareas'];
  selectedFustal: number;
  selectedLatizal: number;
  selectedMontebravo: number;

  gruposFustal: GrupoFustal[] = [];
  gruposLatizal: GrupoLatizal[] = [];
  gruposMontebravo: GrupoMontebravo[] = [];
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private recursosService: RecursosService, private appservice: AppService, private uiService: UiService) {
    super();
  }

  async ngOnInit() {

    this.grupoCnvr = this.data.grupoCnvr;

    this.selectedFustal = this.grupoCnvr.idGrupoFustal != null ? this.grupoCnvr.idGrupoFustal.idGrupoFustal : 0;
    this.selectedLatizal = this.grupoCnvr.idGrupoLatizal != null ? this.grupoCnvr.idGrupoLatizal.idGrupoLatizal : 0;
    this.selectedMontebravo = this.grupoCnvr.idGrupoMontebravo != null ? this.grupoCnvr.idGrupoMontebravo.idGrupoMontebravo : 0;

    this.getGruposList();

    this.recursosForestales = this.data.recursosForestales;

    if (this.data.cnvrList !== undefined) {
      this.cnvrsList = this.data.cnvrList;
    } else {
      if (this.data.grupoCnvr !== undefined) {
        await this.getCnvrByGrupoCnvr();
      } else {
        this.recursosForestales.forEach(recurso => {
          this.cnvrsList.push(new Cnvr(this.grupoCnvr, recurso))
        });
      }
    }
    
    this.setButtons();
  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appservice.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.grupoCnvr.grupoCnvr === undefined || this.grupoCnvr.grupoCnvr === '') {
      return true;
    }

    if (this.grupoCnvr.descripcion === undefined || this.grupoCnvr.descripcion === '') {
      return true;
    }

    if (this.grupoCnvr.haTotal === undefined || this.grupoCnvr.haTotal === null) {
      return true;
    }


    return false;
  }

  private async getCnvrByGrupoCnvr() {
    let items = await firstValueFrom(this.recursosService.getCnvrByGrupoCnvr(this.grupoCnvr.idGrupoCnvr));
    this.cnvrsList = items;
    this.recursosForestales.forEach(recurso => {
      const index = this.cnvrsList.findIndex(cnvr => cnvr.idRecursoForestal.idRecursoForestal === recurso.idRecursoForestal);

      if (index === -1) {
        this.cnvrsList.push(new Cnvr(this.grupoCnvr, recurso));
      }
    });
    this.isLoading = false;

  }

  private getGruposList() {
    this.gruposFustal = this.data.gruposFustal;
    this.gruposLatizal = this.data.gruposLatizal;
    this.gruposMontebravo = this.data.gruposMontebravo;
  }

  deselectGrupoFustal() {
    this.selectedFustal = 0;
  }

  deselectGrupoLatizal() {
    this.selectedLatizal = 0;
  }

  deselectGrupoMontebravo() {
    this.selectedMontebravo = 0;
  }

  updateFustal(value: number) {
    this.selectedFustal = value;

    let indexFustal = this.gruposFustal.findIndex(grupo => grupo.idGrupoFustal == this.selectedFustal);

    if (indexFustal !== -1) {
      this.grupoCnvr.idGrupoFustal = this.gruposFustal[indexFustal];
    } else {
      this.grupoCnvr.idGrupoFustal = null;
    }
  }

  updateLatizal(value: number) {
    this.selectedLatizal = value;

    let indexLatizal = this.gruposLatizal.findIndex(grupo => grupo.idGrupoLatizal == this.selectedLatizal);

    if (indexLatizal !== -1) {
      this.grupoCnvr.idGrupoLatizal = this.gruposLatizal[indexLatizal];
    } else {
      this.grupoCnvr.idGrupoLatizal = null;
    }

  }

  updateMontebravo(value: number) {
    this.selectedMontebravo = value;

    let indexMontebravo = this.gruposMontebravo.findIndex(grupo => grupo.idGrupoMontebravo == this.selectedMontebravo);

    if (indexMontebravo != -1) {
      this.grupoCnvr.idGrupoMontebravo = this.gruposMontebravo[indexMontebravo];
    } else {
      this.grupoCnvr.idGrupoMontebravo = null;
    }
  }

  open(element?: Cnvr) {
    let index = this.cnvrsList.findIndex(cnvr => cnvr.idCnvr === element.idCnvr);

    this.appservice.loadComponent(new ContainerItem(CnvrDataComponent, {
      cnvrList: this.cnvrsList,
      indexCnvr: index,
      grupoCnvr: this.grupoCnvr,
      titleComponent: "Valor del recurso antes / después del incendio",
      isMainComponent: false,
      helpText: 'cnvDataAntesDespuesHelpText'
    }), this.appservice.getRefCurrentDynamicComponent())
  }

  confirm(): void {
    let indexFustal = this.gruposFustal.findIndex(grupo => grupo.idGrupoFustal == this.selectedFustal);
    let indexLatizal = this.gruposLatizal.findIndex(grupo => grupo.idGrupoLatizal == this.selectedLatizal);
    let indexMontebravo = this.gruposMontebravo.findIndex(grupo => grupo.idGrupoMontebravo == this.selectedMontebravo);

    if (indexFustal != -1) {
      this.data.idGrupoFustal = this.gruposFustal[indexFustal];
    } else {
      this.data.idGrupoFustal = null;
    }

    if (indexLatizal != -1) {
      this.data.idGrupoLatizal = this.gruposLatizal[indexLatizal];
    } else {
      this.data.idGrupoLatizal = null;
    }

    if (indexMontebravo != -1) {
      this.data.idGrupoMontebravo = this.gruposMontebravo[indexMontebravo];
    } else {
      this.data.idGrupoMontebravo = null;
    }
  }


  lastId() {
    if (this.cnvrsList.length !== 0) {
      let length = this.cnvrsList.length;
      return this.cnvrsList[length - 1].idCnvr + 1;
    }
    return 1;
  }

  cancelar() {
    this.appservice.goPrev();
  }

  guardar() {
    this.unSaved = false;

    this.recursosService.saveOrUpdateGrupoCnvr(this.grupoCnvr).subscribe(result => {

      this.cnvrsList.forEach(cnvr => {
        this.recursosService.saveOrUpdateCnvr(cnvr).subscribe();
      });

      this.uiService.presentToast("Mensaje guardado");
      this.appservice.goPrev();
    })
  }
}
