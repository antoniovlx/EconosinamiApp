import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecursosNaturalesPageRoutingModule } from './recursos-naturales-routing.module';

import { RecursosNaturalesPage } from './recursos-naturales.page';
import { SharedModule } from '../shared/shared.module';
import { ZonasService } from '../zonas-analisis/components/zonas/services/zonas.service';
import { EspeciesComponent } from './components/especies/especies.component';
import { RecursosComponent } from './components/recursos/recursos.component';
import { RecursoDataComponent } from './components/recursos/recurso-data/recurso-data.component';
import { EspecieDataComponent } from './components/especies/especie-data/especie-data.component';
import { MaderasComponent } from './components/maderas/maderas.component';
import { CambioNetoComponent } from './components/cambio-neto/cambio-neto.component';
import { MaderaDataComponent } from './components/maderas/madera-data/madera-data.component';
import { FustalDataComponent } from './components/maderas/fustal-data/fustal-data.component';
import { LatizalDataComponent } from './components/maderas/latizal-data/latizal-data.component';
import { MontebravoDataComponent } from './components/maderas/montebravo-data/montebravo-data.component';
import { GrupoCnvrDataComponent } from './components/cambio-neto/grupo-cnvr-data/grupo-cnvr-data.component';
import { CnvrLrDataComponent } from './components/cambio-neto/cnvr-lr-data/cnvr-lr-data.component';
import { CnvrDataComponent } from './components/cambio-neto/cnvr-data/cnvr-data.component';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecursosNaturalesPageRoutingModule,
    SharedModule
  ],
  declarations: [RecursosNaturalesPage,
    EspeciesComponent,
    EspecieDataComponent,
    RecursosComponent,
    RecursoDataComponent,
    MaderasComponent,
    MaderaDataComponent,
    FustalDataComponent,
    LatizalDataComponent,
    MontebravoDataComponent,
    CambioNetoComponent,
    GrupoCnvrDataComponent,
    CnvrDataComponent,
    CnvrLrDataComponent],
  providers: [ZonasService, CanDeactivateGuardService, CanActivateGuardService]
})
export class RecursosNaturalesPageModule { }
