import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Home', imagePath: './assets/img/recursos-naturales.png' },
    component: HomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
