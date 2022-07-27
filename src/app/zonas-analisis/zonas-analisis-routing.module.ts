import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';

import { ZonasAnalisisPage } from './zonas-analisis.page';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Zonas de análisis', imagePath: './assets/img/recursos.png' },
    component: ZonasAnalisisPage,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZonasAnalisisPageRoutingModule { }
