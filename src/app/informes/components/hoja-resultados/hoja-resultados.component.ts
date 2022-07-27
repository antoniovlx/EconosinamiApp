import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { TouchSequence } from 'selenium-webdriver';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Medios } from 'src/entities/Medios';
import { Opciones } from 'src/entities/Opciones';
import { PreviaHojaResultadosComponent } from './previa-hoja-resultados/previa-hoja-resultados.component';

enum eDocument {
  ePDF,
  eHTML,
  eEXCEL,
  eTXT
};

enum eTipo {
  eAcumlados,
  ePromedios
};

@Component({
  selector: 'app-hoja-resultados',
  templateUrl: './hoja-resultados.component.html',
  styleUrls: ['./hoja-resultados.component.scss'],
})
export class HojaResultadosComponent implements OnInit, IDataContainer, AfterViewInit {
  static titleComponent: string = "Hoja de resultados";

  opcionesEjecucion: Opciones[] = [];
  gruposComportamientoFuego: GruposDcf[] = [];
  dataCategoriaMedios: any[] = [];

  selectedOpciones: Opciones[] = [];
  selectedGrupos: GruposDcf[] = [];
  displayedColumns = ['titulo']

  selectedType: string = '1';
  selectedDocument: string = '1';

  @Input()
  data: any;
  fileName: string;

  buttons = {
    refComponent: this,
    buttons: []
  }
  categorias: CategoriaMedios[];
  medios: Medios[];

  constructor(private appService: AppService,
    private ejecucionService: EjecucionService,
    private zonasService: ZonasService,
    private mediosService: MediosService,
    private uiService: UiService) { }


  ngOnInit() {
    if (this.data.selectedOpciones !== undefined) {
      this.selectedOpciones = this.data.selectedOpciones;
    }
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Generar", action: "view", icon: "insert_drive_file", class: "green-icon", disabled: this.selectedOpciones.length === 0 || this.selectedGrupos.length === 0 });
    this.appService.setActionButtonsChanged$(this.buttons);
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
        this.selectedGrupos.push(this.gruposComportamientoFuego[0]);
      }
      this.setButtons();
    })


    this.mediosService.getCategoriasMediosExistingMedios().subscribe(categorias => {
      this.dataCategoriaMedios = categorias;
    })
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
    const index = this.selectedGrupos.findIndex(grupo => grupo.idGdcf === idGdcf)

    if (index === -1 && checked) {
      let grupo = this.gruposComportamientoFuego.find(grupo => grupo.idGdcf === idGdcf)
      this.selectedGrupos.push(grupo)
    } else if (index !== -1 && !checked) {
      this.selectedGrupos.splice(index, 1)
    }

    this.setButtons();
  }

  checkGdfc(idGdcf) {
    const index = this.selectedGrupos.findIndex(grupo => grupo.idGdcf === idGdcf)
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

  changeDocumentSelected(value) {
    this.selectedDocument = value;
  }

  async view() {
    const message = await this.checkExistingData();
    if (message === null) {
      this.appService.loadComponent(new ContainerItem(PreviaHojaResultadosComponent, {
        opcionesEjecucion: this.opcionesEjecucion,
        gruposComportamientoFuego: this.gruposComportamientoFuego,
        dataCategoriaMedios: this.dataCategoriaMedios,
        selectedOpciones: this.selectedOpciones,
        selectedGrupos: this.selectedGrupos,
        tipoResultado: Number.parseInt(this.selectedType) - 1,
        tipoDocumento: this.selectedDocument,
        titleComponent: "Visualizar hoja de resultados",
        isMainComponent: false
      }), this.appService.getRefCurrentDynamicComponent())
    } else {
      await this.uiService.avisoAlert("Aviso", message, "medios-combate/3");
    }
  }

  async checkExistingData() {
    let datos = [];

    // deben existir tipos de medios de combate y medios de combate
    //this.grupoMedios = await firstValueFrom(this.mediosService.getGruposMedios());
    this.medios = await firstValueFrom(this.mediosService.getMedios());
    this.categorias = await firstValueFrom(this.mediosService.getCategoriasMedios());
    //this.agrupaciones = await firstValueFrom(this.mediosService.getDreMedios());
    //this.bases = await(firstValueFrom(this.mediosService.getBases()));

    if (this.categorias.length === 0) {
      datos.push("Tipos de medios")
    }

    if (this.medios.length === 0) {
      datos.push("Definición de medios")
    }

    if (datos.length === 0) {
      return null;
    }

    return this.uiService.createMessageAviso(datos);
  }

}
