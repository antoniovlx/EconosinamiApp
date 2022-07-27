import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSlides } from '@ionic/angular';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ContainerComponent } from 'src/app/shared/components/container/container.component';
import { HistoricoFuegos } from 'src/entities/HistoricoFuegos';
import { FilosofiaRecursosComponent } from '../filosofia-recursos/filosofia-recursos/filosofia-recursos.component';
import { AsignacionMediosComponent } from '../opciones-ejecucion/asignacion-medios/asignacion-medios.component';
import { DefinirOpcionesComponent } from '../opciones-ejecucion/definir-opciones/definir-opciones.component';
import { EjecutarCalibracionComponent } from './ejecutar-calibracion/ejecutar-calibracion.component';
import { HistoricoFuegosComponent } from './historico-fuegos/historico-fuegos.component';
import { PrepararCalibracionComponent } from './preparar-calibracion/preparar-calibracion.component';

@Component({
  selector: 'app-calibracion-page',
  templateUrl: './calibracion-page.component.html',
  styleUrls: ['./calibracion-page.component.scss'],
})
export class CalibracionPageComponent implements OnInit {
  isMobile: boolean;
  disableTab = false;

  tab: number = 0;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  @ViewChild("content", { static: false }) content: IonContent;

  segmentList: Array<any> = [
    { name: 'Histórico de fuegos', icon: './assets/img/historicoFuegos.png', },
    { name: 'Preparar calibración', icon: './assets/img/preparar.png' },
    { name: 'Ejecutar calibración', icon: './assets/img/ejecutarCalibracion.png' }
  ]

  selectedSegment: string;

  slideOpts = {
    slidesPerView: 1,
    autoHeight: true
  }

  @ViewChild('slide') slide: IonSlides;

  constructor(private appservice: AppService, private uiService: UiService, private route: ActivatedRoute, private location: Location) {
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
    /*this.containerComponent.loadComponent(new ContainerItem(HistoricoFuegosComponent, {
      titleComponent: "Histórico de fuegos",
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

  segmentSelected(index: number) { 
    this.appservice.clearHistoryComponents();
    this.slide.slideTo(index);

    switch (index) {
      case 0:
        this.containerComponent.loadComponent(new ContainerItem(HistoricoFuegosComponent, {
          titleComponent: "Histórico de fuegos",
          isMainComponent: false
        }));
        break;
      case 1:
        this.containerComponent.loadComponent(new ContainerItem(PrepararCalibracionComponent, {
          titleComponent: "Preparar calibración",
          isMainComponent: false
        }));
        break;
      case 2:
        this.containerComponent.loadComponent(new ContainerItem(EjecutarCalibracionComponent, {
          titleComponent: "Ejecutar calibración",
          isMainComponent: false
        }));
        break;
      default:
        break;
    }

    this.slide.update();
  }

  ionSlideDidChange(event: any) {
    this.slide.getActiveIndex().then(index => {
      this.selectedSegment = this.segmentList[index];
    })
  }

}
