import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSlides } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ContainerComponent } from 'src/app/shared/components/container/container.component';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { Fdr } from 'src/entities/Fdr';
import { Medios } from 'src/entities/Medios';
import { Opciones } from 'src/entities/Opciones';
import { EjecucionService } from '../../services/ejecucion.service';
import { FilosofiaRecursosComponent } from '../filosofia-recursos/filosofia-recursos/filosofia-recursos.component';
import { AsignacionMediosComponent } from './asignacion-medios/asignacion-medios.component';
import { DefinirOpcionesComponent } from './definir-opciones/definir-opciones.component';

@Component({
  selector: 'app-opciones-ejecucion-page',
  templateUrl: './opciones-ejecucion-page.component.html',
  styleUrls: ['./opciones-ejecucion-page.component.scss'],
})
export class OpcionesEjecucionPageComponent implements OnInit {
  isMobile: boolean;
  disableTab = false;

  tab: number = 0;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  @ViewChild("content", { static: false }) content: IonContent;

  segmentList: Array<any> = [
    { name: 'Definir opciones', icon: './assets/img/opciones.png', },
    { name: 'Asignación medios combate', icon: './assets/img/medios.png' }]

  selectedSegment: string;

  slideOpts = {
    slidesPerView: 1,
    autoHeight: true
  }

  @ViewChild('slide') slide: IonSlides;
  categoriaMedios: CategoriaMedios[];
  medios: Medios[];
  opcionesEjecucion: Opciones[];

  constructor(private appservice: AppService, private uiService: UiService, private mediosService: MediosService,
    private ejecucionService: EjecucionService, private route: ActivatedRoute, private location: Location) {
    this.route.params.subscribe(params => {
      if (params.tab !== undefined) {
        this.tab = parseInt(params.tab) - 1;
        this.location.replaceState(this.location.path().slice(0, this.location.path().lastIndexOf('/')))
      }
    });
  }

  ngOnInit(): void {
    this.appservice.getDisableTab$().subscribe(disableTab => {
      this.disableTab = disableTab;
    })

    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });

  }

  ionViewWillEnter() {
    /*this.containerComponent.loadComponent(new ContainerItem(DefinirOpcionesComponent, {
      titleComponent: "Definir opciones de ejecución",
      isMainComponent: false
    }));*/
    this.segmentSelected(this.tab);
    this.selectedSegment = this.segmentList[this.tab];
  }


  ngAfterViewInit(): void {
    this.slide.lockSwipes(true);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  async segmentSelected(index: number) {
    this.appservice.clearHistoryComponents();
    this.slide.slideTo(index);

    switch (index) {
      case 0:
        this.containerComponent.loadComponent(new ContainerItem(DefinirOpcionesComponent, {
          titleComponent: "Definición de opciones de ejecución y asignación de medios de combate",
          isMainComponent: false,
          helpText: 'definirOpcionesHelpText'
        }));
        break;
      case 1:
        const mensaje = await this.checkExistingDataAsignacionMedios();
        if (mensaje === null) {
          this.containerComponent.loadComponent(new ContainerItem(AsignacionMediosComponent, {
            titleComponent: "Asignación medios combate",
            categoriaMedios: this.categoriaMedios,
            opciones: this.opcionesEjecucion,
            helpText: 'asignacionMediosHelpText',
            isMainComponent: false
          }));
        } else {
          await this.uiService.avisoAlert("Aviso", mensaje);
        }
        break;
      default:
        break;
    }

    this.slide.update();
  }

  async checkExistingDataAsignacionMedios() {
    let datos = [];

    // deben existir tipos de medio, definiciones de medios y opciones de ejecucion
    this.categoriaMedios = await firstValueFrom(this.ejecucionService.getCategoriasMediosCompleto());
    this.medios = await firstValueFrom(this.mediosService.getMedios());
    this.opcionesEjecucion = await firstValueFrom(this.ejecucionService.getAllOpcionesEjecucion());

    if (this.categoriaMedios.length === 0) {
      datos.push("Categoria de medios")
    }

    if (this.medios.length === 0) {
      datos.push("Definición de medios de combate")
    }

    if (this.opcionesEjecucion.length === 0) {
      datos.push("Opciones de ejecución")
    }

    if(datos.length === 0)
      return null;

    return this.uiService.createMessageAviso(datos);
  }


  ionSlideDidChange(event: any) {
    this.slide.getActiveIndex().then(index => {
      this.selectedSegment = this.segmentList[index];
    })
  }

}
