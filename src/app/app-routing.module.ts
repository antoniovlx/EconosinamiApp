import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';


export const appPages = [
  { title: 'Créditos', url: 'about', icon: 'warning', img: './assets/img/question.png' },
  { title: 'Home', url: '/home', icon: 'home', img: './assets/img/home.png' },
  { title: 'Zonas de análisis', url: 'zonas-analisis', icon: 'paper-plane', img: './assets/img/analisis.png' },
  { title: 'Recursos naturales', url: 'recursos-naturales', icon: 'heart', img: './assets/img/recursos.png' },
  { title: 'Medios de combate', url: 'medios-combate', icon: 'archive', img: './assets/img/medios-combate.png' },
  { title: 'Ejecución', url: 'ejecucion', icon: 'trash', img: './assets/img/ejecucion.png' },
  { title: 'Informes', url: 'informes', icon: 'warning', img: './assets/img/informes.png' },
  { title: 'Configuración', url: 'configuracion', icon: 'warning', img: './assets/img/configuracion.png' }
]; 


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
  },
  {
    path: 'zonas-analisis',
    loadChildren: () => import('./zonas-analisis/zonas-analisis.module').then( m => m.ZonasAnalisisPageModule)
  },
  {
    path: 'zonas-analisis/:tab',
    loadChildren: () => import('./zonas-analisis/zonas-analisis.module').then( m => m.ZonasAnalisisPageModule)
  },
  {
    path: 'recursos-naturales',
    loadChildren: () => import('./recursos-naturales/recursos-naturales.module').then( m => m.RecursosNaturalesPageModule)
  },
  {
    path: 'recursos-naturales/:tab',
    loadChildren: () => import('./recursos-naturales/recursos-naturales.module').then( m => m.RecursosNaturalesPageModule)
  },
  {
    path: 'medios-combate',

    loadChildren: () => import('./medios-combate/medios-combate.module').then( m => m.MediosCombatePageModule),
  },
  {
    path: 'medios-combate/:tab',

    loadChildren: () => import('./medios-combate/medios-combate.module').then( m => m.MediosCombatePageModule),
  },
  {
    path: 'ejecucion',
    loadChildren: () => import('./ejecucion/ejecucion.module').then( m => m.EjecucionPageModule),
  },
  {
    path: 'ejecucion/:tab',
    loadChildren: () => import('./ejecucion/ejecucion.module').then( m => m.EjecucionPageModule),
  },
  {
    path: 'informes',
    loadChildren: () => import('./informes/informes.module').then( m => m.InformesPageModule),
  },
  {
    path: 'informes/:tab',
    loadChildren: () => import('./informes/informes.module').then( m => m.InformesPageModule),
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion.module').then( m => m.ConfiguracionPageModule),
  },
  {
    path: 'configuracion/:id',
    loadChildren: () => import('./configuracion/configuracion.module').then( m => m.ConfiguracionPageModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
