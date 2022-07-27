import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZonasAnalisisPageRoutingModule } from './zonas-analisis-routing.module';

import { ZonasAnalisisPage } from './zonas-analisis.page';
import { SharedModule } from '../shared/shared.module';
import { GruposComportamientoComponent } from './components/comportamiento/components/grupos-comportamiento/grupos-comportamiento.component';
import { ComportamientoService } from './components/comportamiento/services/comportamiento.service';
import { LrDataComponent } from './components/zonas/components/lr-data/lr-data.component';
import { ZamifDataComponent } from './components/zonas/components/zamif-data/zamif-data.component';
import { ZonasComponent } from './components/zonas/components/zonas/zonas.component';
import { ZonasService } from './components/zonas/services/zonas.service';
import { CostePromedioComponent } from './components/coste-promedio/coste-promedio.component';
import { ComportamientoDataComponent } from './components/comportamiento/components/comportamiento-data/comportamiento-data.component';
import { EscapadosDataComponent } from './components/comportamiento/components/escapados-data/escapados-data.component';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';
import { CanActivateGuardService } from '../services/can-activate-guard.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZonasAnalisisPageRoutingModule,
    SharedModule
  ],
  declarations: [ZonasAnalisisPage, ZonasComponent, 
    GruposComportamientoComponent, 
    ComportamientoDataComponent, 
    EscapadosDataComponent,
    CostePromedioComponent,
    ZamifDataComponent, 
    LrDataComponent],
  providers: [ZonasService, ComportamientoService, CanDeactivateGuardService, CanActivateGuardService]
})
export class ZonasAnalisisPageModule {}
