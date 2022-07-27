import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ContainerComponent } from 'src/app/shared/components/container/container.component';
import { FilosofiaRecursosComponent } from '../filosofia-recursos/filosofia-recursos/filosofia-recursos.component';
import { EjecutarComponent } from './ejecutar/ejecutar.component';

@Component({
  selector: 'app-ejecutar-page',
  templateUrl: './ejecutar-page.component.html',
  styleUrls: ['./ejecutar-page.component.scss'],
})
export class EjecutarPageComponent implements OnInit {

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
  }

  ionViewWillEnter() {
    this.containerComponent.loadComponent(new ContainerItem(EjecutarComponent, {
      titleComponent: "Descripción ejecutar simulación",
      isMainComponent: false,
      helpText: 'ejecutarSimulacionHelpText'
    }));
  }

  ngAfterViewInit(): void {
 
  }

}
