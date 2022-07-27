import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HojaResultadosComponent } from 'src/app/informes/components/hoja-resultados/hoja-resultados.component';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ContainerComponent } from 'src/app/shared/components/container/container.component';
import { DynamicDirective } from 'src/app/shared/directives/dynamic.directive';
import { FilosofiaRecursosComponent } from './filosofia-recursos/filosofia-recursos.component';

@Component({
  selector: 'filosofia-container',
  templateUrl: './filosofia-page.component.html',
  styleUrls: ['./filosofia-page.component.scss'],
})
export class FilosofiaPageComponent implements OnInit {
  data: any;

  isMobile: boolean;
  disableTab = false;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  @ViewChild("content", { static: false }) content: IonContent;

  constructor(private appService: AppService, private uiService: UiService, private translate: TranslateService) {

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
    this.containerComponent.loadComponent(new ContainerItem(FilosofiaRecursosComponent, {
      titleComponent: "Filosofias de despacho de recursos",
      isMainComponent: false,
      helpText: 'filosofiaHelpText'
    }));
  };


  ngAfterViewInit(): void {

  }
}
