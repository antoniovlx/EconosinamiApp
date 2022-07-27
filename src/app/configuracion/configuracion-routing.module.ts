import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracionPage } from './configuracion.page';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Configuración', imagePath: './assets/img/configuracion.png' },
    component: ConfiguracionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionPageRoutingModule {}
