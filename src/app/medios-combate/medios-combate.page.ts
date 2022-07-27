import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSlides } from '@ionic/angular';
import { AppService, ContainerItem } from '../services/app.service';
import { UiService } from '../services/ui.service';
import { ContainerComponent } from '../shared/components/container/container.component';
import { AgrupacionesComponent } from './components/agrupaciones/agrupaciones.component';
import { DefinicionComponent } from './components/definicion/definicion.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { TiposComponent } from './components/tipos/tipos.component';
import { UbicacionesComponent } from './components/ubicaciones/ubicaciones.component';

@Component({
  selector: 'app-medios-combate',
  templateUrl: './medios-combate.page.html',
  styleUrls: ['./medios-combate.page.scss'],
})
export class MediosCombatePage implements OnInit {

  isMobile: boolean;
  disableTab = false;

  tab: number =  0;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  @ViewChild("content", { static: false }) content: IonContent;

  segmentList: Array<any> = [
    { name: 'Ubicación de medios', icon: './assets/img/location.png', },
    { name: 'Agrupaciones de medios', icon: './assets/img/agrupacion.png' },
    { name: 'Tipos', icon: './assets/img/categoria.png' },
    { name: 'Grupos', icon: './assets/img/grupos.png' },
    { name: 'Definición', icon: './assets/img/medios.png' }];

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

  ionViewWillEnter(){
    /*this.containerComponent.loadComponent(new ContainerItem(UbicacionesComponent, {
      titleComponent: UbicacionesComponent.titleComponent,
      isMainComponent: true
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
        this.containerComponent.loadComponent(new ContainerItem(UbicacionesComponent, {
          titleComponent: UbicacionesComponent.titleComponent,
          isMainComponent: true,
          helpText: 'basesHelpText'
        }));
        break;
      case 1:
        this.containerComponent.loadComponent(new ContainerItem(AgrupacionesComponent, {
          titleComponent: AgrupacionesComponent.titleComponent,
          isMainComponent: true
        }));
        break;
      case 2:
        this.containerComponent.loadComponent(new ContainerItem(TiposComponent, {
          titleComponent: TiposComponent.titleComponent,
          isMainComponent: true,
          helpText: 'tipoMedioHelpText'
        }));
        break;
      case 3:
        this.containerComponent.loadComponent(new ContainerItem(GruposComponent, {
          titleComponent: GruposComponent.titleComponent,
          isMainComponent: true,
          helpText: 'grupoMedioHelpText'
        }));
        break;
      case 4:
        this.containerComponent.loadComponent(new ContainerItem(DefinicionComponent, {
          titleComponent: DefinicionComponent.titleComponent,
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
