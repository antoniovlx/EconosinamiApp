import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forEach } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ContainerComponent } from 'src/app/shared/components/container/container.component';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { Medios } from 'src/entities/Medios';
import { Zamif } from 'src/entities/Zamif';
import { FilosofiaRecursosComponent } from '../filosofia-recursos/filosofia-recursos/filosofia-recursos.component';
import { InventarioRecursosDataComponent } from './inventario-recursos-data/inventario-recursos-data.component';

@Component({
  selector: 'app-inventario-recursos-page',
  templateUrl: './inventario-recursos-page.component.html',
  styleUrls: ['./inventario-recursos-page.component.scss'],
})
export class InventarioRecursosPageComponent implements OnInit {
  data: any;

  isMobile: boolean;
  disableTab = false;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  @ViewChild("content", { static: false }) content: IonContent;
  zamifList: Zamif[];

  medios: Medios[];

  constructor(private appService: AppService, private uiService: UiService, 
    private zonasService: ZonasService, private mediosService: MediosService, private translate: TranslateService) {

  }

  ngOnInit(): void {
    this.appService.getDisableTab$().subscribe(disableTab => {
      this.disableTab = disableTab;
    })

    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });
  }

  async ionViewWillEnter() {
    const message = await this.checkExistingData();
    if (message === null) {
      this.containerComponent.loadComponent(new ContainerItem(InventarioRecursosDataComponent, {
        titleComponent: "Inventario de medios",
        zamifList: this.zamifList,
        medios: this.medios,
        isMainComponent: false
      }));
    } else {
      this.appService.goPrev();
      await this.uiService.avisoAlert("Aviso", message);
    }

  }

  async checkExistingData() {
    let datos = [];

    // deben existir zamif, lr y medios de combate
    this.zamifList = await firstValueFrom(this.zonasService.getAllZamif());
    this.medios = await firstValueFrom(this.mediosService.getMedios());

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

    if (this.medios.length === 0)
      datos.push("Medios de combate");

    if (datos.length === 0) {
      return null
    }

    return this.uiService.createMessageAviso(datos);
  }

  ngAfterViewInit(): void {

  }
}
