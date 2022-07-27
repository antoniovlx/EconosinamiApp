import { Component, OnInit } from '@angular/core';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Opciones } from 'src/entities/Opciones';
import { PreviaGraficoCostoComponent } from './previa-grafico-costo/previa-grafico-costo.component';

@Component({
  selector: 'app-grafico-costo',
  templateUrl: './grafico-costo.component.html',
  styleUrls: ['./grafico-costo.component.scss'],
})
export class GraficoCostoComponent implements OnInit {

  static titleComponent: string = "Gráfico costo - valor neto de los recursos"

  opcionesEjecucion: Opciones[] = [];
  gruposComportamientoFuego: GruposDcf[] = [];

  selectedOpciones: Opciones[] = [];
  selectedGrupo: GruposDcf [] = [];
  displayedColumns = ['titulo']

  selectedDocument: string = "1"
  fileName: string;

  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private uiService: UiService,
    private appService: AppService, private zonasService: ZonasService, private ejecucionService: EjecucionService) { }

  ngOnInit() {
    this.ejecucionService.getAllOpcionesEjecucion().subscribe(values => {
      if(values.length !== 0){
        this.opcionesEjecucion = values;
        this.selectedOpciones.push(this.opcionesEjecucion[0]);
      }
      this.setButtons();
    })

    this.zonasService.getGdcfList().subscribe(values => {
      if(values.length !== 0){
        this.gruposComportamientoFuego = values;
        this.selectedGrupo = [this.gruposComportamientoFuego[0]];
      }
      this.setButtons();
    })

    /*this.translate.get('Gráfico costo - valor neto de los recursos').subscribe((res: string) => {
      this.fileName = res;
    });*/
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Generar", action: "view", icon: "insert_drive_file", class: "green-icon", disabled: this.selectedOpciones.length === 0 || this.selectedGrupo.length === 0 });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  updateOpciones(idOpcion, checked) {
    const index = this.selectedOpciones.findIndex(opcion => opcion.idOpcion === idOpcion)

    if (index === -1 && checked) {
      let ejecucion = this.opcionesEjecucion.find(opcion => opcion.idOpcion === idOpcion)
      this.selectedOpciones.push(ejecucion)
    } else if (index !== -1 && !checked) {
      this.selectedOpciones.splice(index, 1)
    }

    this.setButtons();
  }

  updateGdcf(idGdcf, checked) {
    const index = this.selectedGrupo.findIndex(grupo => grupo.idGdcf === idGdcf)

    if (index === -1 && checked) {
      let grupo = this.gruposComportamientoFuego.find(grupo => grupo.idGdcf === idGdcf)
      this.selectedGrupo = [grupo];
    } else if (index !== -1 && !checked) {
      this.selectedGrupo.splice(index, 1)
    }

    this.setButtons();
  }

  checkGdfc(idGdcf) {
    const index = this.selectedGrupo.findIndex(grupo => grupo.idGdcf === idGdcf)
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }



  checkOpcion(idOpcion) {
    const index = this.selectedOpciones.findIndex(opcion => opcion.idOpcion === idOpcion)
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }

  changeDocumentSelected(event) {
    this.selectedDocument = event.value;
  }

  view() {
    if (this.selectedOpciones.length == 0 || this.selectedGrupo == null) {
      this.uiService.presentAlertToast("Opción y grupo de datos de comportamiento del fuego son campos obligatorios");
      return false;
    }

    this.appService.loadComponent(new ContainerItem(PreviaGraficoCostoComponent, {
      gruposComportamientoFuego: this.gruposComportamientoFuego,
      selectedOpciones: this.selectedOpciones,
      selectedGrupos: this.selectedGrupo,
      tipoDocumento: this.selectedDocument,
      titleComponent: "Visualizar Costo-Cambio neto en el valor de los recursos",
      isMainComponent: false
    }), this.appService.getRefCurrentDynamicComponent())
  }

}
