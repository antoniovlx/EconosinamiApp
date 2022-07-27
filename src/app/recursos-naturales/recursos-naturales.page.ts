import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSlides } from '@ionic/angular';
import { AppService, ContainerItem } from '../services/app.service';
import { UiService } from '../services/ui.service';
import { ContainerComponent } from '../shared/components/container/container.component';
import { CambioNetoComponent } from './components/cambio-neto/cambio-neto.component';
import { EspeciesComponent } from './components/especies/especies.component';
import { MaderasComponent } from './components/maderas/maderas.component';
import { RecursosComponent } from './components/recursos/recursos.component';

@Component({
  selector: 'recursos-naturales',
  templateUrl: './recursos-naturales.page.html',
  styleUrls: ['./recursos-naturales.page.scss'],
})
export class RecursosNaturalesPage implements OnInit {
  isMobile: boolean;
  disableTab = false;
  tab: number = 0;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  segmentList: Array<any> = [
    { name: 'Especies', icon: './assets/img/species.png', },
    { name: 'Recursos', icon: './assets/img/recursos.png' },
    { name: 'Maderas', icon: './assets/img/maderas.png' },
    { name: 'Cambio neto valor', icon: './assets/img/cambioneto.png' }];

  selectedSegment: string;

  slideOpts = {
    slidesPerView: 1,
    autoHeight: true
  }

  @ViewChild('slide') slide: IonSlides;

  @ViewChild("content", { static: false }) content: IonContent;


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
    /*this.selectedSegment = this.segmentList[0];
    this.containerComponent.loadComponent(new ContainerItem(EspeciesComponent, {
      titleComponent: "Definición de especies",
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
        this.containerComponent.loadComponent(new ContainerItem(EspeciesComponent, {
          titleComponent: "Definición de especies",
          isMainComponent: true,
          helpText: 'especiesHelpText'
        }));
        break;
      case 1:
        this.containerComponent.loadComponent(new ContainerItem(RecursosComponent, {
          titleComponent: "Definición de recursos",
          isMainComponent: true,
          helpText: 'recursosHelpText'
        }));
        break;
      case 2:
        this.containerComponent.loadComponent(new ContainerItem(MaderasComponent, {
          titleComponent: "Definición de zonas de maderas",
          isMainComponent: true,
          helpText: 'zonasMaderaHelpText'
        }));
        break;
      case 3:
        this.containerComponent.loadComponent(new ContainerItem(CambioNetoComponent, {
          titleComponent: "Definición de grupos de cambio neto en el valor de los recursos",
          isMainComponent: true,
          helpText: 'cnvHelpText'
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
