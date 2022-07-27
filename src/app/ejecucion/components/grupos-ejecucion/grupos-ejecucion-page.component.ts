import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ContainerComponent } from 'src/app/shared/components/container/container.component';
import { GruposEjecucionComponent } from './grupos-ejecucion/grupos-ejecucion.component';

@Component({
  selector: 'grupos-ejecucion-page',
  templateUrl: './grupos-ejecucion-page.component.html',
  styleUrls: ['./grupos-ejecucion-page.component.scss'],
})
export class GruposEjecucionPageComponent implements OnInit {
    data: any;
  
    isMobile: boolean;
    disableTab = false;
  
    @ViewChild(ContainerComponent)
    containerComponent: ContainerComponent;
  
    @ViewChild("content", { static: false }) content: IonContent;
  
    constructor(private appService: AppService, private uiService: UiService) {
  
    }
  
    ngOnInit(): void {
      this.appService.getDisableTab$().subscribe(disableTab => {
        this.disableTab = disableTab;
      })
  
      this.uiService.getTopScrolled$().subscribe(scrolled => {
        this.content.scrollToTop();
      });
      this.appService.setActionButtonsChanged$([]);
    }
  
    ionViewWillEnter() {
      this.containerComponent.loadComponent(new ContainerItem(GruposEjecucionComponent, {
        titleComponent: "Definición de grupos de ejecución",
        isMainComponent: false
      }));
    }
  }
  