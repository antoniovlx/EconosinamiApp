import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Opciones } from 'src/entities/Opciones';
import { PreviaSumarioOpcionesComponent } from './previa-sumario-opciones/previa-sumario-opciones.component';

@Component({
  selector: 'app-sumario-opciones',
  templateUrl: './sumario-opciones.component.html',
  styleUrls: ['./sumario-opciones.component.scss'],
})
export class SumarioOpcionesComponent implements OnInit, AfterViewInit {
  static titleComponent: string = "Sumario de opciones";

  opcionesEjecucion: Opciones[] = [];
  gruposComportamientoFuego: GruposDcf[] = [];

  selectedOpciones: Opciones[] = [];
  selectedGrupo: GruposDcf[] = [];
  displayedColumns = ['titulo']

  selectedType: string = "1";
  selectedOrdenar: string = "1"
  selectedDocument: string = "1"
  fileName: string;

  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private uiService: UiService,
    private appService: AppService, private ejecucionService: EjecucionService, private zonasService: ZonasService) { }

  ngOnInit() {
    /*this.translate.get('Sumario de opciones').subscribe((res: string) => {
      this.fileName = res;
    });*/
  }

  ngAfterViewInit(): void {
    this.ejecucionService.getAllOpcionesEjecucion().subscribe(values => {
      if (values.length !== 0) {
        this.opcionesEjecucion = values;
        this.selectedOpciones.push(this.opcionesEjecucion[0]);
      }
      this.setButtons();
    })

    this.zonasService.getGdcfList().subscribe(values => {
      if (values.length !== 0) {
        this.gruposComportamientoFuego = values;
        this.selectedGrupo.push(this.gruposComportamientoFuego[0]);
      }
      this.setButtons();
    })
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

  changeTypeSelected(value) {
    this.selectedType = value;
  }

  changeOrdenarSelected(value) {
    this.selectedOrdenar = value;
  }

  changeDocumentSelected(value) {
    this.selectedDocument = value;
  }

  view() {
    if (this.opcionesEjecucion.length == 0 || this.selectedGrupo == undefined) {
      this.uiService.presentAlertToast("Debe seleccionar una opción y un grupo de datos de comportamiento del fuego");
      return false;
    }

    this.appService.loadComponent(new ContainerItem(PreviaSumarioOpcionesComponent, {
      opcionesEjecucion: this.opcionesEjecucion,
      gruposComportamientoFuego: this.gruposComportamientoFuego,
      selectedOpciones: this.selectedOpciones,
      selectedGrupos: this.selectedGrupo,
      tipoResultado: Number.parseInt(this.selectedType) - 1,
      tipoDocumento: this.selectedDocument,
      ordenarPor: Number.parseInt(this.selectedOrdenar) - 1,
      titleComponent: "Ver sumario de opciones",
      isMainComponent: false
    }), this.appService.getRefCurrentDynamicComponent())
  }
}
