import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Opciones } from 'src/entities/Opciones';
import { Zamif } from 'src/entities/Zamif';
import { RecursoDataComponent } from '../recursos-naturales/components/recursos/recurso-data/recurso-data.component';
import { AppService, ContainerItem } from '../services/app.service';
import { UiService } from '../services/ui.service';
import { ZonasService } from '../zonas-analisis/components/zonas/services/zonas.service';
import { DatosEjecucionService } from './services/datos-ejecucion.service';
import { EjecucionService } from './services/ejecucion.service';

@Component({
  selector: 'ejecucion-menu',
  templateUrl: './ejecucion-menu.page.html',
  styleUrls: ['./ejecucion-menu.page.scss'],
})
export class EjecucionMenuPage implements OnInit {
  
  @ViewChild(IonContent, { static: false }) content: IonContent;

  zamifList: Zamif[] = [];

  opcionesList: Opciones[] = [];

  constructor(private uiService: UiService, 
    private datosEjecucionService: DatosEjecucionService,
    private zonasService: ZonasService,
    private ejecucionService: EjecucionService,
    private router: Router) { }

  ngOnInit() {
    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });

    this.zonasService.getAllZamif().subscribe(zamifList => {
      this.zamifList = zamifList;
    })

    this.ejecucionService.getAllOpcionesEjecucion().subscribe(opcionesList => {
      this.opcionesList = opcionesList;
    })

  }

  generarTablaIntensidades(){
    // antes de generar tabla de intensidades, deben existir opciones de ejecución y zonas de análisis

    this.datosEjecucionService.calcularAutoOST(this.opcionesList, this.zamifList).then(() =>{
      this.uiService.presentToast("Tabla de intensidades de medios generada correctamente");
    })
  }

  open(path: string){
    this.router.navigate([path]);
  }
}
