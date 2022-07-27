import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MediosCombatePageRoutingModule } from './medios-combate-routing.module';

import { MediosCombatePage } from './medios-combate.page';
import { SharedModule } from '../shared/shared.module';
import { UbicacionesComponent } from './components/ubicaciones/ubicaciones.component';
import { TiposComponent } from './components/tipos/tipos.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { DefinicionComponent } from './components/definicion/definicion.component';
import { AgrupacionesComponent } from './components/agrupaciones/agrupaciones.component';
import { ZonasService } from '../zonas-analisis/components/zonas/services/zonas.service';
import { BaseDataComponent } from './components/ubicaciones/base-data/base-data.component';
import { CanActivateGuardService } from '../services/can-activate-guard.service';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';
import { DreMedioDataComponent } from './components/agrupaciones/dre-medio-data/dre-medio-data.component';
import { CategoriaMedioDataComponent } from './components/tipos/categoria-medio-data/categoria-medio-data.component';
import { MedioDataComponent } from './components/definicion/medio-data/medio-data.component';
import { DatosGeneralesMedioComponent } from './components/definicion/datos-generales-medio/datos-generales-medio.component';
import { RecursosMedioComponent } from './components/definicion/recursos-medio/recursos-medio.component';
import { PresupuestosMedioComponent } from './components/definicion/presupuestos-medio/presupuestos-medio.component';
import { GrupoMedioDataComponent } from './components/grupos/grupo-medio-data/grupo-medio-data.component';
import { RatiosProduccionComponent } from './components/grupos/ratios-produccion/ratios-produccion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MediosCombatePageRoutingModule,
    SharedModule
  ],
  declarations: [MediosCombatePage, UbicacionesComponent, TiposComponent,
    GruposComponent, DefinicionComponent, AgrupacionesComponent, BaseDataComponent, DreMedioDataComponent, GrupoMedioDataComponent,
    CategoriaMedioDataComponent, MedioDataComponent, DatosGeneralesMedioComponent, RecursosMedioComponent, PresupuestosMedioComponent,
    RatiosProduccionComponent],
  providers: [ZonasService, CanActivateGuardService, CanDeactivateGuardService]
})
export class MediosCombatePageModule { }
