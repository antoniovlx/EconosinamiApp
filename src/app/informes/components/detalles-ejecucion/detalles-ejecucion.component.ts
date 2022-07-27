import { Component, OnInit } from '@angular/core';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Opciones } from 'src/entities/Opciones';
import { Zamif } from 'src/entities/Zamif';
import { PreviaDetallesEjecucionComponent } from './previa-detalles-ejecucion/previa-detalles-ejecucion.component';

@Component({
  selector: 'app-detalles-ejecucion',
  templateUrl: './detalles-ejecucion.component.html',
  styleUrls: ['./detalles-ejecucion.component.scss'],
})
export class DetallesEjecucionComponent implements OnInit {
  static titleComponent: string = "Detalles de ejecución";

  zamifList: Zamif[] = [];
  opcionesEjecucion: Opciones[] = [];
  gruposComportamientoFuego: GruposDcf[] = [];

  selectedZamif: Zamif[] = [];
  selectedOpciones: Opciones[] = [];
  selectedGrupo: GruposDcf[] = [];
  displayedColumns = ['titulo']

  selectedInformes: { id: number, checked: boolean }[] = [];

  selectedDocument: string = "1"
  selected: boolean;
  fileName: string;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private uiService: UiService,
    private appService: AppService, private zonasService: ZonasService, private ejecucionService: EjecucionService) { }

  ngOnInit() {
    this.zonasService.getAllZamif().subscribe(values => {
      if(values.length !== 0){
        this.zamifList = values;
        this.selectedZamif.push(this.zamifList[0]);
      }
      this.setButtons();
    })

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

    this.selected = true;

    this.selectedInformes.push({ id: 1, checked: true });

    /*this.translate.get('Detalles de ejecución').subscribe((res: string) => {
      this.fileName = res;
    });*/
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({
      label: "Generar", action: "view", icon: "insert_drive_file", class: "green-icon",
      disabled: this.selectedOpciones.length === 0 || this.selectedGrupo.length === 0 || this.selectedZamif.length === 0 || this.selectedInformes.length === 0
    });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  updateZamif(idZamif, checked) {
    const index = this.selectedZamif.findIndex(zamif => zamif.idZamif === idZamif)

    if (index === -1 && checked) {
      let zamif = this.zamifList.find(zamif => zamif.idZamif === idZamif)
      this.selectedZamif.push(zamif)
    } else if (index !== -1 && !checked) {
      this.selectedZamif.splice(index, 1)
    }

    this.setButtons();
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



  checkZamif(idZamif) {
    const index = this.selectedZamif.findIndex(zamif => zamif.idZamif === idZamif)
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

  updateInformesSelected(idInforme, event) {
    const checked = event.detail.checked;
    const index = this.selectedInformes.findIndex(Informe => Informe.id === idInforme)

    if (index === -1 && checked) {
      this.selectedInformes.push({ "id": idInforme, "checked": checked })
    } else if (index !== -1 && !checked) {
      this.selectedInformes.splice(index, 1)
    }

    this.setButtons();
  }

  changeDocumentSelected(event) {
    this.selectedDocument = event.value;
  }

  view() {
    if (this.selectedZamif.length == 0 || this.selectedOpciones.length == 0 || this.selectedGrupo == null || this.selectedInformes.length == 0) {
      this.uiService.presentAlertToast("Debe seleccionar una zona, una opción, un grupo de datos de comportamiento del fuego y al menos una tabla");
      return false;
    }

    this.appService.loadComponent(new ContainerItem(PreviaDetallesEjecucionComponent, {
      gruposComportamientoFuego: this.gruposComportamientoFuego,
      selectedZamif: this.selectedZamif,
      selectedOpciones: this.selectedOpciones,
      selectedGrupos: this.selectedGrupo,
      tipoDocumento: this.selectedDocument,
      selectedTables: this.selectedInformes,
      titleComponent: "Ver detalles ejecución",
      isMainComponent: false
    }), this.appService.getRefCurrentDynamicComponent())
  }

}
