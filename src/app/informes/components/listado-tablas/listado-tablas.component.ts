import { Component, OnInit } from '@angular/core';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Zamif } from 'src/entities/Zamif';
import { PreviaHojaResultadosComponent } from '../hoja-resultados/previa-hoja-resultados/previa-hoja-resultados.component';
import { PreviaListadoTablasComponent } from './previa-listado-tablas/previa-listado-tablas.component';

@Component({
  selector: 'app-listado-tablas',
  templateUrl: './listado-tablas.component.html',
  styleUrls: ['./listado-tablas.component.scss'],
})
export class ListadoTablasComponent implements OnInit {
  static titleComponent: string = "Listado de tablas";

  zamifList: Zamif[] = [];
  gruposComportamientoFuego: GruposDcf[] = [];

  selectedZamif: Zamif[] = [];
  selectedGrupo: GruposDcf[] = [];
  displayedColumns = ['titulo']

  selectedTables: { id: number, checked: boolean }[] = [];
  selectedDocument: string = "1"
  selected: boolean;
  fileName: string;

  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private uiService: UiService,
    private appService: AppService, private zonasService: ZonasService) { }

  ngOnInit() {
    this.selected = true;

    this.zonasService.getAllZamif().subscribe(values => {
      if (values.length !== 0) {
        this.zamifList = values;
        this.selectedZamif.push(this.zamifList[0]);
      }
      this.setButtons();
    })

    this.zonasService.getGdcfList().subscribe(values => {
      if (values.length !== 0) {
        this.gruposComportamientoFuego = values;
        this.selectedGrupo = [this.gruposComportamientoFuego[0]];
      }
      this.setButtons();
    })

    this.selectedTables.push({ id: 1, checked: true });

    /*this.translate.get('Listado de tablas').subscribe((res: string) => {
      this.fileName = res;
    });*/
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({
      label: "Generar", action: "view", icon: "insert_drive_file", class: "green-icon", disabled: this.selectedZamif.length === 0
        || this.selectedGrupo.length === 0 || this.selectedTables.length === 0
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

  checkZamif(idZamif) {
    const index = this.selectedZamif.findIndex(zamif => zamif.idZamif === idZamif)
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
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

  updateTablesSelected(idTable, event) {
    const index = this.selectedTables.findIndex(table => table.id === idTable)

    if (index === -1 && event.detail.checked) {
      this.selectedTables.push({ "id": idTable, "checked": event.detail.checked })
    } else if (index !== -1 && !event.detail.checked) {
      this.selectedTables.splice(index, 1)
    }

    this.setButtons();
  }

  changeDocumentSelected(value) {
    this.selectedDocument = value;
  }

  view() {
    if (this.zamifList.length == 0 || this.selectedGrupo == null || this.selectedTables.length == 0) {
      this.uiService.presentAlertToast("Debe seleccionar una zona, un grupo de datos de comportamiento del fuego y al menos una tabla");
      return false;
    }

    this.appService.loadComponent(new ContainerItem(PreviaListadoTablasComponent, {
      gruposComportamientoFuego: this.gruposComportamientoFuego,
      selectedGrupos: this.selectedGrupo,
      selectedZamif: this.selectedZamif,
      selectedTables: this.selectedTables,
      tipoDocumento: this.selectedDocument,
      titleComponent: "Ver listado tablas",
      isMainComponent: false
    }), this.appService.getRefCurrentDynamicComponent())
  }

}
