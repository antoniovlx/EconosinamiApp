import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';

import { InformesPage } from './informes.page';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Resultados', imagePath: './assets/img/informes.png' },
    component: InformesPage,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesPageRoutingModule {}
