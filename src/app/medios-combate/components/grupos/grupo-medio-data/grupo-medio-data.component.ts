import { Component, Input, OnInit } from '@angular/core';
import { element } from 'protractor';
import { firstValueFrom } from 'rxjs';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { LrDataComponent } from 'src/app/zonas-analisis/components/zonas/components/lr-data/lr-data.component';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { Dre } from 'src/entities/Dre';
import { GrupoMedios } from 'src/entities/GrupoMedios';
import { Lr } from 'src/entities/Lr';
import { ModelosCombustible } from 'src/entities/ModelosCombustible';
import { RatiosProduccion } from 'src/entities/RatiosProduccion';
import { TipoAeronave } from 'src/entities/TipoAeronave';
import { RatiosProduccionComponent } from '../ratios-produccion/ratios-produccion.component';

@Component({
  selector: 'app-grupo-medio-data',
  templateUrl: './grupo-medio-data.component.html',
  styleUrls: ['./grupo-medio-data.component.scss'],
})
export class GrupoMedioDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  selectedTipoUnidad: string;
  selectedAgrupacion: number;
  selectedCategoria: number;
  selectedTipoAeronave: string;

  agrupaciones: Dre[] = [];
  categorias: CategoriaMedios[] = [];
  tipoAeronaves: TipoAeronave[] = [];
  ratiosProduccions: RatiosProduccion[] = [];
  newData: boolean;
  changed: boolean = false;

  grupoMedios: GrupoMedios;
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private appService: AppService, private mediosService: MediosService, private zonasService: ZonasService, private uiService: UiService, public util: UtilService) { }

  ngOnInit() {
    this.grupoMedios = this.data.grupo;

    this.initTipoUnidad();

    if (this.grupoMedios.grupoMedios === undefined)
      this.newData = true;

    this.getAgrupacionesMedios();

    this.getCategoriaMedios();

    this.getTipoAeronaves();

    if (this.data.ratios !== undefined && !this.data.back) {
      this.ratiosProduccions = this.data.ratios;
      this.changed = true;
    }

    if (this.data.selectedCategoria !== undefined || this.data.selectedAgrupacion !== undefined
      ||  this.data.selectedTipoUnidad !== undefined) {
      this.selectedCategoria = this.data.selectedCategoria;
      this.selectedAgrupacion = this.data.selectedAgrupacion;
      this.selectedTipoUnidad = this.data.selectedTipoUnidad;
    }

    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.grupoMedios.descripcion === undefined || this.grupoMedios.descripcion === '') {
      return true;
    }

    if (this.grupoMedios.grupoMedios === undefined || this.grupoMedios.grupoMedios === '') {
      return true;
    }

    if (this.grupoMedios.velocidad === undefined || this.grupoMedios.velocidad === null) {
      return true;
    }

    if (this.grupoMedios.demoraInicio === undefined || this.grupoMedios.demoraInicio === null) {
      return true;
    }

    if(this.selectedAgrupacion === undefined  || this.selectedCategoria === undefined){
      return true;
    }

    return false;
  }


  private getTipoAeronaves() {
    this.mediosService.getTipoAeronaves().subscribe(result => {
      this.tipoAeronaves = result;
      this.selectedTipoAeronave = this.grupoMedios.tipoAeronave?.idTipoAeronave;
    });
  }

  private getCategoriaMedios() {
      this.categorias = this.data.categorias;
      this.selectedCategoria = this.grupoMedios.idCategoriaMedios?.idCategoriaMedios;
  }

  private getAgrupacionesMedios() {
      this.agrupaciones = this.data.agrupaciones;
      this.selectedAgrupacion = this.grupoMedios.idDre?.idDre;
  }

  initTipoUnidad() {
    this.selectedTipoUnidad = this.grupoMedios.tipoUnidad?.toString();

    if (this.selectedTipoUnidad === undefined) this.selectedTipoUnidad = "3"

    if (this.selectedTipoUnidad == '1') {
      this.selectedTipoAeronave = '0';
      this.grupoMedios.maximoDescargas = 0;
      this.grupoMedios.tiempoParaRelleno = 0;
      this.grupoMedios.numPersonasEnRelleno = 0;
    }
    else if (this.selectedTipoUnidad == '2') {
      this.grupoMedios.tiempoParaRelleno = 0;
      this.grupoMedios.numPersonasEnRelleno = 0;
    }
    else if (this.selectedTipoUnidad == '3') {
      this.grupoMedios.maximoDescargas = 0;
    }
  }

  changeTipoUnidadSelected(event) {
    this.selectedTipoUnidad = event.detail.value;
  }

  changeTipoAeronaveSelected(event) {
    this.selectedTipoAeronave = event.detail.value;
  }

  changeAgrupacion(event) {
    this.selectedAgrupacion = event.detail.value;
    this.setButtons();
  }

  changeTipoMedio(event) {
    this.selectedCategoria = event.detail.value;
    this.setButtons();
  }

  async openRatiosData() {
    if (!this.newData && !this.changed) {
      this.mediosService.getRatiosByGrupoMedio(this.grupoMedios.idGrupoMedios).subscribe(async ratios => {
        if (ratios.length === 0) {
          await this.initRatiosTable();
        } else {
          this.ratiosProduccions = ratios;
        }

        this.loadComponent();
      });
    } else {
      if (this.ratiosProduccions.length === 0) {
        await this.initRatiosTable();
      }
      this.loadComponent();
    }
  }

  private async initRatiosTable() {
    let modelos = await firstValueFrom(this.zonasService.getModelosCombustibles())
    modelos.forEach(modelo => {
      this.ratiosProduccions.push(new RatiosProduccion(modelo, this.grupoMedios));
    });
  }

  loadComponent() {
    this.appService.loadComponent(new ContainerItem(RatiosProduccionComponent, {
      ratios: this.ratiosProduccions,
      grupoMedios: this.grupoMedios,
      selectedAgrupacion: this.selectedAgrupacion,
      selectedCategoria: this.selectedCategoria,
      selectedTipoUnidad: this.selectedTipoUnidad, 
      titleComponent: "Ratios de producción de lineas",
      isMainComponent: false
    }), this.appService.getRefCurrentDynamicComponent())
  }

  guardar() {
    this.grupoMedios.tipoUnidad = Number.parseInt(this.selectedTipoUnidad !== undefined ? this.selectedTipoUnidad : "0");
    this.grupoMedios.idDre = this.agrupaciones.filter(dre => dre.idDre === this.selectedAgrupacion)[0];
    this.grupoMedios.idCategoriaMedios = this.categorias.filter(categoria => categoria.idCategoriaMedios === this.selectedCategoria)[0];
    this.grupoMedios.tipoAeronave = this.tipoAeronaves.filter(tipo => tipo.idTipoAeronave === this.selectedTipoAeronave)[0];

    this.unSaved = false;

    this.mediosService.saveOrUpdateGrupoMedios(this.grupoMedios).subscribe(result => {

      this.ratiosProduccions.forEach(ratio => {
        this.mediosService.saveOrUpdateRatiosMedios(ratio).subscribe();
      })

      this.uiService.presentToast("Mensaje guardado");
      this.appService.goPrev();
    })
  }

  cancelar() {
    this.appService.goPrev();
  }

}
