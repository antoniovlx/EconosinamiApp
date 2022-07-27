import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule, MatLabel, } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DynamicDirective } from './directives/dynamic.directive';
import { TituloApartadoComponent } from './components/titulo-apartado/titulo-apartado.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { ContainerComponent } from './components/container/container.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SubtituloVentanaComponent } from './components/subtitulo-ventana/subtitulo-ventana.component';
import { ButtonActionsComponent } from './components/button-actions/button-actions.component';

@NgModule({
  declarations: [BreadcrumbComponent, DynamicDirective, TituloApartadoComponent, MapaComponent, ContainerComponent, LoadingComponent, 
    SubtituloVentanaComponent, ButtonActionsComponent],
  imports: [
    TranslateModule.forChild(),
    IonicModule,
    CommonModule,
    RouterModule,
    MatTableModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatTabsModule,
    MatIconModule, MatGridListModule, MatSidenavModule, MatRadioModule,
    MatListModule, MatCardModule, MatButtonModule, MatExpansionModule, MatProgressSpinnerModule
  ],
  exports: [
    TranslateModule,
    BreadcrumbComponent,
    TituloApartadoComponent,
    MatTableModule,
    MatToolbarModule,
    MatCheckboxModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatProgressSpinnerModule,
    MatIconModule, MatGridListModule, MatSidenavModule, MatTableModule, MatRadioModule,
    MatListModule, MatCardModule, MatButtonModule, MatExpansionModule, MatInputModule, DynamicDirective
    , MapaComponent, ContainerComponent, LoadingComponent, SubtituloVentanaComponent, ButtonActionsComponent
  ]
})
export class SharedModule { }
