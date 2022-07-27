import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';
import { CalibracionPageComponent } from './components/calibracion/calibracion-page.component';
import { CambioNetoValorPageComponent } from './components/cambio-neto-valor/cambio-neto-valor-page.component';
import { EjecutarPageComponent } from './components/ejecutar/ejecutar-page.component';
import { FilosofiaPageComponent } from './components/filosofia-recursos/filosofia-page.component';
import { GruposEjecucionPageComponent } from './components/grupos-ejecucion/grupos-ejecucion-page.component';
import { InventarioRecursosPageComponent } from './components/inventario-recursos/inventario-recursos-page.component';
import { OpcionesEjecucionPageComponent } from './components/opciones-ejecucion/opciones-ejecucion-page.component';

import { EjecucionMenuPage } from './ejecucion-menu.page';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Ejecución', imagePath: './assets/img/ejecucion.png' },
    component: EjecucionMenuPage,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'filosofias',
    data: { breadcrumb: 'Filosofías', imagePath: './assets/img/filosofia.png' },
    component: FilosofiaPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'grupos-ejecucion',
    data: { breadcrumb: 'Grupos de ejecución', imagePath: './assets/img/grupo-ejecucion.png' },
    component: GruposEjecucionPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'opciones',
    data: { breadcrumb: 'Opciones de ejecución', imagePath: './assets/img/opciones-ejecucion.png' },
    component: OpcionesEjecucionPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'opciones/:tab',
    data: { breadcrumb: 'Opciones de ejecución', imagePath: './assets/img/opciones-ejecucion.png' },
    component: OpcionesEjecucionPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'cambio-valor-neto',
    data: { breadcrumb: 'Cambio neto valor recurso', imagePath: './assets/img/cambio-valor-neto.png' },
    component: CambioNetoValorPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'inventario-medios',
    data: { breadcrumb: 'Inventario de medios', imagePath: './assets/img/inventario.png' },
    component: InventarioRecursosPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'tabla-intensidades',
    data: { breadcrumb: 'Tabla intensidades medios', imagePath: './assets/img/tabla.png' },
    component: FilosofiaPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'calibracion',
    data: { breadcrumb: 'Calibración', imagePath: './assets/img/calibracion.png' },
    component: CalibracionPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'calibracion/:tab',
    data: { breadcrumb: 'Calibración', imagePath: './assets/img/calibracion.png' },
    component: CalibracionPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  },
  {
    path: 'ejecutar',
    data: { breadcrumb: 'Ejecutar simulación', imagePath: './assets/img/run.png' },
    component: EjecutarPageComponent,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjecucionPageRoutingModule { }
