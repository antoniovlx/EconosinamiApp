import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Especie } from 'src/entities/Especies';
import { Fustal } from 'src/entities/Fustal';
import { IntensidadFustal } from 'src/entities/IntensidadFustal';
import { IntensidadLatizal } from 'src/entities/IntensidadLatizal';
import { IntensidadMontebravo } from 'src/entities/IntensidadMontebravo';
import { Latizal } from 'src/entities/Latizal';
import { Montebravo } from 'src/entities/Montebravo';
import { FustalDataComponent } from '../fustal-data/fustal-data.component';
import { LatizalDataComponent } from '../latizal-data/latizal-data.component';
import { MontebravoDataComponent } from '../montebravo-data/montebravo-data.component';

@Component({
  selector: 'app-madera-data',
  templateUrl: './madera-data.component.html',
  styleUrls: ['./madera-data.component.scss'],
})
export class MaderaDataComponent extends TableClass implements OnInit, IDataContainer {
  @Input()
  data: any;

  displayedColumns: string[] = ['especie', 'porcentaje'];
  titulo: string = '';
  isFustal: boolean = false;
  isLatizal: boolean = false;
  isMontebravo: boolean = false;
  codigo: string;
  madera: any;
  especiesList: Especie[];
  maderaData = [];
  intensidades: IntensidadFustal[] | IntensidadLatizal[] | IntensidadMontebravo[];
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private appservice: AppService,
    private translate: TranslateService, private recursosService: RecursosService, private uiService: UiService) {
    super();
  }

  ngOnInit() {
    this.madera = this.data.madera;
    this.refreshData();
    this.setButtons();
  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appservice.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.codigo === undefined || this.codigo === '') {
      return true;
    }

    if (this.madera.descripcion === undefined || this.madera.descripcion === '') {
      return true;
    }

    return false;
  }

  async refreshData() {
    if (this.madera.grupoFustal !== undefined) {
      await this.getGrupoFustalData();
    } else if (this.madera.grupoLatizal !== undefined) {
      await this.getGrupoLatizalData();
    } else if (this.madera.grupoMontebravo !== undefined) {
      await this.getGrupoMontebravoData();
    }

    this.getEspeciesList();
  }


  private async getGrupoMontebravoData() {
    this.isMontebravo = true;
    this.codigo = this.madera.grupoMontebravo;

    const montebravos = await firstValueFrom(this.recursosService.getMontebravoByGrupo(this.madera.idGrupoMontebravo));
      this.maderaData = montebravos;

      this.checkMontebravoEdited();

      this.intensidades = [
        new IntensidadMontebravo(1),
        new IntensidadMontebravo(2),
        new IntensidadMontebravo(3),
        new IntensidadMontebravo(4),
        new IntensidadMontebravo(5),
        new IntensidadMontebravo(6),
      ];
      this.isLoading = false;

  }

  checkMontebravoEdited() {
    if (this.data.montebravo !== undefined) {
      const index = this.maderaData.findIndex(element => element.idMontebravo === this.data.montebravo.idMontebravo);
      if (index !== -1) {
        this.maderaData[index] = this.data.montebravo;
      }
    }
  }

  private async getGrupoLatizalData() {
    this.isLatizal = true;
    this.codigo = this.madera.grupoLatizal;

    const latizals = await firstValueFrom(this.recursosService.getLatizalByGrupo(this.madera.idGrupoLatizal));
    this.maderaData = latizals;

    this.checkLatizalEdited();

    this.intensidades = [
      new IntensidadLatizal(1),
      new IntensidadLatizal(2),
      new IntensidadLatizal(3),
      new IntensidadLatizal(4),
      new IntensidadLatizal(5),
      new IntensidadLatizal(6),
    ];
    this.isLoading = false;


  }

  checkLatizalEdited() {
    if (this.data.latizal !== undefined) {
      const index = this.maderaData.findIndex(element => element.idLatizal === this.data.latizal.idLatizal);
      if (index !== -1) {
        this.maderaData[index] = this.data.latizal;
      }
    }
  }

  private async getGrupoFustalData() {
    this.isFustal = true;
    this.codigo = this.madera.grupoFustal;

    const fustals = await firstValueFrom(this.recursosService.getFustalByGrupo(this.madera.idGrupoFustal));
    this.maderaData = fustals;

    this.checkFustalEdited();

    this.intensidades = [
      new IntensidadFustal(1),
      new IntensidadFustal(2),
      new IntensidadFustal(3),
      new IntensidadFustal(4),
      new IntensidadFustal(5),
      new IntensidadFustal(6)
    ];
    this.isLoading = false;
  }

  checkFustalEdited() {
    if (this.data.fustal !== undefined) {
      const index = this.maderaData.findIndex(element => element.idFustal === this.data.fustal.idFustal);
      if (index !== -1) {
        this.maderaData[index] = this.data.fustal;
      }
    }
  }

  private getEspeciesList() {

    this.especiesList = this.data.especiesList;
    this.especiesList.forEach(especie => {
      const index = this.maderaData.findIndex(
        (row: Fustal | Latizal | Montebravo) => row.idEspecie.idEspecie === especie.idEspecie);

      // no había datos de la especie, la añadimos según tipo de madera
      if (index === -1) {
        if (this.isFustal)
          this.maderaData.push(new Fustal(especie, this.madera, this.intensidades));
        else if (this.isLatizal)
          this.maderaData.push(new Latizal(especie, this.madera, this.intensidades));
        else if (this.isMontebravo)
          this.maderaData.push(new Montebravo(especie, this.madera, this.intensidades));

      }
    });

    this.checkFustalEdited();
    this.checkLatizalEdited();
    this.checkMontebravoEdited();

  }

  open(row) {
    this.madera.grupoFustal !== undefined ? this.openFustal(row)
      : this.madera.grupoLatizal !== undefined ? this.openLatizal(row)
        : this.openMontebravo(row);
  }

  openFustal(element: Fustal) {
    this.madera.grupoFustal = this.codigo;

    if (element.intensidadFustals.length === 0) {
      element.intensidadFustals = [
        new IntensidadFustal(1),
        new IntensidadFustal(2),
        new IntensidadFustal(3),
        new IntensidadFustal(4),
        new IntensidadFustal(5),
        new IntensidadFustal(6)
      ];
    }

    this.appservice.loadComponent(new ContainerItem(FustalDataComponent, {
      fustal: element,
      zonaMadera: this.madera,
      titleComponent: "Datos de Madera madura (Fustal)",
      isMainComponent: false,
      helpText: 'fustalDataHelpText'
    }), this.appservice.getRefCurrentDynamicComponent())
  }

  openLatizal(element: Latizal) {
    this.madera.grupoLatizal = this.codigo;

    if (element.intensidadLatizals.length === 0) {
      element.intensidadLatizals = [
        new IntensidadLatizal(1),
        new IntensidadLatizal(2),
        new IntensidadLatizal(3),
        new IntensidadLatizal(4),
        new IntensidadLatizal(5),
        new IntensidadLatizal(6)
      ];
    }

    this.appservice.loadComponent(new ContainerItem(LatizalDataComponent, {
      latizal: element,
      zonaMadera: this.madera,
      titleComponent: "Datos de Madera inmadura (Latizal)",
      isMainComponent: false,
      helpText: 'latizalDataHelpText'
    }), this.appservice.getRefCurrentDynamicComponent())
  }

  openMontebravo(element: Montebravo) {
    this.madera.grupoMontebravo = this.codigo;

    if (element.intensidadMontebravos.length === 0) {
      element.intensidadMontebravos = [
        new IntensidadMontebravo(1),
        new IntensidadMontebravo(2),
        new IntensidadMontebravo(3),
        new IntensidadMontebravo(4),
        new IntensidadMontebravo(5),
        new IntensidadMontebravo(6)
      ];
    }

    this.appservice.loadComponent(new ContainerItem(MontebravoDataComponent, {
      montebravo: element,
      zonaMadera: this.madera,
      titleComponent: "Datos de Madera inmadura (Montebravo)",
      isMainComponent: false,
      helpText: 'montebravoDataHelpText'
    }), this.appservice.getRefCurrentDynamicComponent())
  }

  guardar() {
    this.unSaved = false;

    if (this.isFustal) {
      this.madera.grupoFustal = this.codigo;
      this.recursosService.saveOrUpdateGrupoFustal(this.madera).subscribe(
        result => {
          this.maderaData.forEach(fustal => {
            this.recursosService.saveOrUpdateFustal(fustal).subscribe();
          })
        }
      );

    } else if (this.isLatizal) {
      this.madera.grupoLatizal = this.codigo;
      this.recursosService.saveOrUpdateGrupoLatizal(this.madera).subscribe(result => {
        this.maderaData.forEach(latizal => {
          this.recursosService.saveOrUpdateLatizal(latizal).subscribe();
        })
      });

    } else {
      this.madera.grupoMontebravo = this.codigo;
      this.recursosService.saveOrUpdateGrupoMontebravo(this.madera).subscribe(result => {
        this.maderaData.forEach(montebravo => {
          this.recursosService.saveOrUpdateMontebravo(montebravo).subscribe();
        })
      });
    }

    this.uiService.presentToast("Mensaje guardado");

    this.appservice.goPrev();
  }

  cancelar() {
    this.appservice.goPrev();
  }
}
