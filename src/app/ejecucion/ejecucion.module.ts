import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjecucionPageRoutingModule } from './ejecucion-routing.module';

import { SharedModule } from '../shared/shared.module';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';
import { EjecucionService } from './services/ejecucion.service';
import { EjecucionMenuPage } from './ejecucion-menu.page';
import { FilosofiaRecursosComponent } from './components/filosofia-recursos/filosofia-recursos/filosofia-recursos.component';
import { DefinirOpcionesComponent } from './components/opciones-ejecucion/definir-opciones/definir-opciones.component';
import { AsignacionMediosComponent } from './components/opciones-ejecucion/asignacion-medios/asignacion-medios.component';
import { FilosofiaPageComponent } from './components/filosofia-recursos/filosofia-page.component';
import { CalibracionPageComponent } from './components/calibracion/calibracion-page.component';
import { CambioNetoValorPageComponent } from './components/cambio-neto-valor/cambio-neto-valor-page.component';
import { EjecutarPageComponent } from './components/ejecutar/ejecutar-page.component';
import { InventarioRecursosPageComponent } from './components/inventario-recursos/inventario-recursos-page.component';
import { GruposEjecucionPageComponent } from './components/grupos-ejecucion/grupos-ejecucion-page.component';
import { FilosofiaDataComponent } from './components/filosofia-recursos/filosofia-data/filosofia-data.component';
import { GruposEjecucionComponent } from './components/grupos-ejecucion/grupos-ejecucion/grupos-ejecucion.component';
import { GruposEjecucionDataComponent } from './components/grupos-ejecucion/grupos-ejecucion-data/grupos-ejecucion-data.component';
import { OpcionesEjecucionPageComponent } from './components/opciones-ejecucion/opciones-ejecucion-page.component';
import { CambioNetoValorDataComponent } from './components/cambio-neto-valor/cambio-neto-valor-data/cambio-neto-valor-data.component';
import { ZonasService } from '../zonas-analisis/components/zonas/services/zonas.service';
import { InventarioRecursosDataComponent } from './components/inventario-recursos/inventario-recursos-data/inventario-recursos-data.component';
import { MediosService } from '../medios-combate/services/medios.service';
import { HistoricoFuegosComponent } from './components/calibracion/historico-fuegos/historico-fuegos.component';
import { PrepararCalibracionComponent } from './components/calibracion/preparar-calibracion/preparar-calibracion.component';
import { EjecutarCalibracionComponent } from './components/calibracion/ejecutar-calibracion/ejecutar-calibracion.component';
import { DatosEjecucionService } from './services/datos-ejecucion.service';
import { OpcionesDataComponent } from './components/opciones-ejecucion/opciones-data/opciones-data.component';
import { EjecutarComponent } from './components/ejecutar/ejecutar/ejecutar.component';
import { DatosCalibracionComponent } from './components/calibracion/ejecutar-calibracion/datos-calibracion/datos-calibracion.component';
import { ComportamientoFuegoComponent } from './components/calibracion/ejecutar-calibracion/datos-calibracion/comportamiento-fuego/comportamiento-fuego.component';
import { FuegosIntensidadComponent } from './components/calibracion/ejecutar-calibracion/datos-calibracion/fuegos-intensidad/fuegos-intensidad.component';
import { TamanosCalculadosComponent } from './components/calibracion/ejecutar-calibracion/datos-calibracion/tamanos-calculados/tamanos-calculados.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjecucionPageRoutingModule,
    SharedModule
  ],
  declarations: [
    EjecucionMenuPage,
    FilosofiaRecursosComponent,
    FilosofiaPageComponent,
    FilosofiaDataComponent,
    CalibracionPageComponent,
    CambioNetoValorPageComponent,
    EjecutarPageComponent,
    GruposEjecucionComponent,
    GruposEjecucionPageComponent,
    GruposEjecucionDataComponent,
    InventarioRecursosPageComponent,
    DefinirOpcionesComponent,
    OpcionesDataComponent,
    AsignacionMediosComponent,
    OpcionesEjecucionPageComponent,
    CambioNetoValorDataComponent,
    InventarioRecursosDataComponent,
    HistoricoFuegosComponent,
    PrepararCalibracionComponent,
    EjecutarCalibracionComponent,
    DatosCalibracionComponent,
    ComportamientoFuegoComponent,
    FuegosIntensidadComponent,
    TamanosCalculadosComponent,
    EjecutarComponent
  ],
  providers: [EjecucionService, DatosEjecucionService, ZonasService, CanActivateGuardService, CanDeactivateGuardService]
})
export class EjecucionPageModule { }
