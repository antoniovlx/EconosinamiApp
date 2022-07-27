import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides } from '@ionic/angular';
import { AppService, ContainerItem } from '../services/app.service';
import { UiService } from '../services/ui.service';
import { ContainerComponent } from '../shared/components/container/container.component';
import { DetallesEjecucionComponent } from './components/detalles-ejecucion/detalles-ejecucion.component';
import { GraficoCostoComponent } from './components/grafico-costo/grafico-costo.component';
import { HojaResultadosComponent } from './components/hoja-resultados/hoja-resultados.component';
import { ListadoTablasComponent } from './components/listado-tablas/listado-tablas.component';
import { SumarioOpcionesComponent } from './components/sumario-opciones/sumario-opciones.component';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {
  isMobile: boolean;
  disableTab = false;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  @ViewChild("content", { static: false }) content: IonContent;

  segmentList: Array<any> = [
    { name: 'Hoja de resultados', icon: './assets/img/hoja_resultados.png', },
    { name: 'Sumario de opciones', icon: './assets/img/summary.png' },
    { name: 'Listado de tablas', icon: './assets/img/listado-tablas.png' },
    { name: 'Detalles de ejecución', icon: './assets/img/detalles-ejecucion.png' },
    { name: 'Gráfico costo - valor neto de los recursos', icon: './assets/img/grafico_costo.png' }
  ];

  selectedSegment: string;

  slideOpts = {
    slidesPerView: 1,
    autoHeight: true
  }

  @ViewChild('slide') slide: IonSlides;

  constructor(private appservice: AppService, private uiService: UiService) {
    this.selectedSegment = this.segmentList[0];

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
    this.containerComponent.loadComponent(new ContainerItem(HojaResultadosComponent, {
      titleComponent: HojaResultadosComponent.titleComponent,
      isMainComponent: true
    }));
  }

  ngAfterViewInit(): void {
    this.slide.lockSwipes(true);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);

  }

  segmentSelected(item: string, index: number) {
    this.appservice.clearHistoryComponents();
    this.slide.slideTo(index);

    switch (index) {
      case 0:
        this.containerComponent.loadComponent(new ContainerItem(HojaResultadosComponent, {
          titleComponent: HojaResultadosComponent.titleComponent,
          isMainComponent: true
        }));
        break;
      case 1:
        this.containerComponent.loadComponent(new ContainerItem(SumarioOpcionesComponent, {
          titleComponent: SumarioOpcionesComponent.titleComponent,
          isMainComponent: true
        }));
        break;
      case 2:
        this.containerComponent.loadComponent(new ContainerItem(ListadoTablasComponent, {
          titleComponent: ListadoTablasComponent.titleComponent,
          isMainComponent: true
        }));
        break;
      case 3:
        this.containerComponent.loadComponent(new ContainerItem(DetallesEjecucionComponent, {
          titleComponent: DetallesEjecucionComponent.titleComponent,
          isMainComponent: true
        }));
        break;
      case 4:
        this.containerComponent.loadComponent(new ContainerItem(GraficoCostoComponent, {
          titleComponent: GraficoCostoComponent.titleComponent,
          isMainComponent: true
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
