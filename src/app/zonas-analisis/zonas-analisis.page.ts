import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, UrlTree } from '@angular/router';
import { IonContent, IonSlides, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { Zamif } from 'src/entities/Zamif';
import { AppService, ContainerItem } from '../services/app.service';
import { UiService } from '../services/ui.service';
import { ContainerComponent } from '../shared/components/container/container.component';
import { GruposComportamientoComponent } from './components/comportamiento/components/grupos-comportamiento/grupos-comportamiento.component';
import { CostePromedioComponent } from './components/coste-promedio/coste-promedio.component';
import { ZonasComponent } from './components/zonas/components/zonas/zonas.component';
import { ZonasService } from './components/zonas/services/zonas.service';



@Component({
  selector: 'zonas-analisis',
  templateUrl: './zonas-analisis.page.html',
  styleUrls: ['./zonas-analisis.page.scss'],
})
export class ZonasAnalisisPage implements OnInit {
  isMobile: boolean;
  disableTab = false;
  tab: number = 0;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  zamifList: Zamif[] = [];

  @ViewChild("content", { static: false }) content: IonContent;

  segmentList: Array<any> = [
    { name: 'Zonas de análisis', icon: './assets/img/zonas_analisis.png', },
    { name: 'Datos del comportamiento del fuego', icon: './assets/img/comportamiento_fuego.png' },
    { name: 'Coste promedio por hectárea', icon: './assets/img/coste_promedio.png' }];

  selectedSegment: string;

  slideOpts = {
    slidesPerView: 1,
    autoHeight: true
  }

  @ViewChild('slide') slide: IonSlides;

  constructor(private appservice: AppService, private uiService: UiService, private route: ActivatedRoute, 
    private location: Location, private zonasService: ZonasService, private translate: TranslateService) {
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
    /*this.containerComponent.loadComponent(new ContainerItem(ZonasComponent, {
      titleComponent: "Definición de Zonas de análisis de manejo de incendios forestales",
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

  async segmentSelected(index: number) {
    this.appservice.clearHistoryComponents();
    this.slide.slideTo(index);

    switch (index) {
      case 0:
        this.containerComponent.loadComponent(new ContainerItem(ZonasComponent, {
          titleComponent: "Definición de Zonas de análisis de manejo de incendios forestales",
          isMainComponent: true,
          helpText: 'zamifHelpText'
        }));
        break;
      case 1:
        this.containerComponent.loadComponent(new ContainerItem(GruposComportamientoComponent, {
          titleComponent: "Definición de grupos de datos de comportamiento del fuego",
          isMainComponent: true,
          helpText: 'gdcfHelpText'
        }));
        break;
      case 2:
        const message = await this.checkExistingDataCph();
        if (message !== null) {
          await this.uiService.avisoAlert("Aviso", message);
        } else{
          this.containerComponent.loadComponent(new ContainerItem(CostePromedioComponent, {
            titleComponent: "Coste promedio por hectárea",
            isMainComponent: true,
            zamifList: this.zamifList,
            helpText: 'cphHelpText'
          }));
        }
        break;
      default:
        break;
    }

    this.slide.update();
  }

  async checkExistingDataCph() {
    let datos = [];

    this.zonasService.getZamifList();
    // deben existir ZAMIF
    this.zamifList = await firstValueFrom(this.zonasService.getZamifLoaded$());

    if (this.zamifList.length === 0) {
      datos.push("Zonas de análisis");
    } else {
      const message = await firstValueFrom(this.translate.get("lugares representativos en el Zamif"))
      for (let index = 0; index < this.zamifList.length; index++) {
        const zamif = this.zamifList[index];
        if (zamif.lrs.length === 0) {
          datos.push(message + ": (" + zamif.zamif + ") " + zamif.descripcion);
        }
      }
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
