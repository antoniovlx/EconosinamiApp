import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformesPageRoutingModule } from './informes-routing.module';

import { InformesPage } from './informes.page';
import { SharedModule } from '../shared/shared.module';
import { ZonasService } from '../zonas-analisis/components/zonas/services/zonas.service';
import { DetallesEjecucionComponent } from './components/detalles-ejecucion/detalles-ejecucion.component';
import { GraficoCostoComponent } from './components/grafico-costo/grafico-costo.component';
import { HojaResultadosComponent } from './components/hoja-resultados/hoja-resultados.component';
import { ListadoTablasComponent } from './components/listado-tablas/listado-tablas.component';
import { SumarioOpcionesComponent } from './components/sumario-opciones/sumario-opciones.component';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';
import { EjecucionService } from '../ejecucion/services/ejecucion.service';
import { PreviaHojaResultadosComponent } from './components/hoja-resultados/previa-hoja-resultados/previa-hoja-resultados.component';
import { PreviaDetallesEjecucionComponent } from './components/detalles-ejecucion/previa-detalles-ejecucion/previa-detalles-ejecucion.component';
import { PreviaGraficoCostoComponent } from './components/grafico-costo/previa-grafico-costo/previa-grafico-costo.component';
import { PreviaListadoTablasComponent } from './components/listado-tablas/previa-listado-tablas/previa-listado-tablas.component';
import { PreviaSumarioOpcionesComponent } from './components/sumario-opciones/previa-sumario-opciones/previa-sumario-opciones.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformesPageRoutingModule,
    SharedModule
  ],
  declarations: [PreviaHojaResultadosComponent, 
    PreviaDetallesEjecucionComponent,
    PreviaGraficoCostoComponent,
    PreviaListadoTablasComponent,
    PreviaSumarioOpcionesComponent,
    InformesPage, 
    DetallesEjecucionComponent,
     GraficoCostoComponent, 
     HojaResultadosComponent, 
    ListadoTablasComponent, 
    SumarioOpcionesComponent],
  providers: [ZonasService, EjecucionService, CanActivateGuardService, CanDeactivateGuardService]
})
export class InformesPageModule {}
