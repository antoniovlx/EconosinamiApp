import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';

import { RecursosNaturalesPage } from './recursos-naturales.page';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Recursos naturales', imagePath: './assets/img/recursos.png' },
    component: RecursosNaturalesPage,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecursosNaturalesPageRoutingModule {}
