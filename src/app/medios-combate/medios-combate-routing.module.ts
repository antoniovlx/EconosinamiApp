import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';

import { MediosCombatePage } from './medios-combate.page';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Medios de combate', imagePath: './assets/img/medios-combate.png' },
    component: MediosCombatePage,
    canDeactivate: [CanDeactivateGuardService],
    canActivate: [CanActivateGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediosCombatePageRoutingModule {}
