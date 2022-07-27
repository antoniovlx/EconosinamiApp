import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides } from '@ionic/angular';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { Bases } from 'src/entities/Bases';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { Dre } from 'src/entities/Dre';
import { GrupoMedios } from 'src/entities/GrupoMedios';
import { Medios } from 'src/entities/Medios';

@Component({
  selector: 'app-medio-data',
  templateUrl: './medio-data.component.html',
  styleUrls: ['./medio-data.component.scss'],
})
export class MedioDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  medio: Medios;

  unSaved: boolean;

  isMobile: boolean;

  segment = '0';

  slideOpts = {
    slidesPerView: 1,
    autoHeight: true
  }

  @ViewChild('slider') slider: IonSlides;

  buttons = {
    refComponent: this,
    buttons: []
  }
  
  grupoMedios: GrupoMedios[];
  categoriasMedios: CategoriaMedios[];
  agrupacionesMedios: Dre[];
  bases: Bases[];

  constructor(private appService: AppService, private mediosService: MediosService, private uiService: UiService) { 
    
  }

  ngOnInit() {
    this.medio = this.data.medio;
    this.grupoMedios = this.data.grupoMedios;
    this.categoriasMedios = this.data.categoriasMedios;
    this.agrupacionesMedios = this.data.agrupacionesMedios;
    this.bases = this.data.bases;
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.medio.medio === undefined || this.medio.medio === '') {
      return true;
    }

    if (this.medio.descripcion === undefined || this.medio.descripcion === '') {
      return true;
    }

    if (this.medio.idDre === undefined || this.medio.idDre === null) {
      return true;
    }

    if (this.medio.idCategoriaMedios === undefined || this.medio.idCategoriaMedios === null) {
      return true;
    }

    if (this.medio.idBase === undefined || this.medio.idBase === null) {
      return true;
    }

    if (this.medio.demoraInicio === undefined || this.medio.demoraInicio === null) {
      return true;
    }

    if (this.medio.velocidad === undefined || this.medio.velocidad === null) {
      return true;
    }

    return false;
  }

  guardar(){
    this.unSaved = false;

    let presupuestos = this.medio.presupuestos;
    this.medio.presupuestos = undefined;

    this.mediosService.saveOrUpdateMedios(this.medio).subscribe(result =>{
      presupuestos.forEach(presupuesto =>{
        this.mediosService.saveOrUpdatePresupuestos(presupuesto).subscribe();
      })
     
      this.uiService.presentToast("Mensaje guardado");
      this.appService.goPrev();
    })
  }

  cancelar(){
    this.appService.goPrev();
  }

  ionViewWillEnter(){
    
  }

  ngAfterViewInit(): void {
    this.slider.lockSwipes(true);
  }

  segmentSelected(index) {
    this.slider.lockSwipes(false);
    this.slider.slideTo(index);
    this.slider.lockSwipes(true);
  }

  async slideChanged() {
    const value = await this.slider.getActiveIndex();
    this.segment = value.toString();
  }

  updateMedioByGrupoMedio(grupoMedios: GrupoMedios){
    this.medio.tipoUnidad = grupoMedios.tipoUnidad;
    this.medio.costeBasico = grupoMedios.costeBasico;
    this.medio.costePorRecarga = grupoMedios.costePorRecarga;
    this.medio.incrementoPorKm = grupoMedios.incrementoPorKm;
    this.medio.demoraInicio = grupoMedios.demoraInicio;
    this.medio.velocidad = grupoMedios.velocidad;
    this.medio.maximoDescargas = grupoMedios.maximoDescargas;
    this.medio.intensidadActivacion = grupoMedios.intensidadActivacion;
    this.medio.tiempoParaRelleno = grupoMedios.tiempoParaRelleno;
    this.medio.numPersonasEnRelleno = grupoMedios.numPersonasEnRelleno;

    this.setButtons();
  }

  updateMedio(medio: Medios){
    this.medio = medio; 
    this.medio.necesitaAgua = "True";
    this.medio.calcularAutoInventario = "True";
    this.mediosService.setMediosChanged(this.medio);

    this.setButtons();
  }

}
