import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CambioNetoComponent } from 'src/app/recursos-naturales/components/cambio-neto/cambio-neto.component';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ContainerComponent } from 'src/app/shared/components/container/container.component';
import { Cnvr } from 'src/entities/Cnvr';
import { Dre } from 'src/entities/Dre';
import { GrupoCnvr } from 'src/entities/GrupoCnvr';
import { RecursosForestales } from 'src/entities/RecursosForestales';
import { EjecucionService } from '../../services/ejecucion.service';
import { FilosofiaRecursosComponent } from '../filosofia-recursos/filosofia-recursos/filosofia-recursos.component';
import { CambioNetoValorDataComponent } from './cambio-neto-valor-data/cambio-neto-valor-data.component';

@Component({
  selector: 'app-cambio-neto-valor-page',
  templateUrl: './cambio-neto-valor-page.component.html',
  styleUrls: ['./cambio-neto-valor-page.component.scss'],
})
export class CambioNetoValorPageComponent implements OnInit {

  data: any;

  isMobile: boolean;
  disableTab = false;

  @ViewChild(ContainerComponent)
  containerComponent: ContainerComponent;

  @ViewChild("content", { static: false }) content: IonContent;
  gruposCnvr: GrupoCnvr[];
  cnvrList: Cnvr[];

  constructor(private appService: AppService, private uiService: UiService,
    private ejecucionService: EjecucionService, private recursosService: RecursosService) {

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
      this.containerComponent.loadComponent(new ContainerItem(CambioNetoValorDataComponent, {
        titleComponent: "Calcular cambio neto en el valor de los recursos",
        gruposCnvr: this.gruposCnvr,
        isMainComponent: false
      }));
    } else {
      await this.uiService.avisoAlert("Aviso", message , "recursos-naturales/4");
    }
  }

  async checkExistingData() {
    let datos = [];
    // deben existir grupos de coste neto del valor de los recursos y datos de algún recurso antes y después del incendio
    this.gruposCnvr = await firstValueFrom(this.ejecucionService.getGruposCnvr());

    if (this.gruposCnvr.length === 0) {
      datos.push("Grupos de cambio neto en el valor de los recursos");
    } else {
      for (let index = 0; index < this.gruposCnvr.length; index++) {
        const grupo = this.gruposCnvr[index];
        let cnvrList = await firstValueFrom(this.ejecucionService.getCnvrByGrupoCnvr(grupo.idGrupoCnvr));
        if (cnvrList.length === 0) {
          datos.push("datos de algún recurso antes y después del incendio en el grupo (" + grupo.idGrupoCnvr + ") " + grupo.grupoCnvr);
        }
      }
    }

    if (datos.length === 0)
      return null;

    return this.uiService.createMessageAviso(datos);
  }

  ngAfterViewInit(): void {

  }

}
