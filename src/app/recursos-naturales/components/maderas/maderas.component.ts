import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { GrupoFustal } from 'src/entities/GrupoFustal';
import { GrupoLatizal } from 'src/entities/GrupoLatizal';
import { GrupoMontebravo } from 'src/entities/GrupoMontebravo';
import { RecursosService } from '../../services/recursos.service';
import { MaderaDataComponent } from './madera-data/madera-data.component';

@Component({
  selector: 'app-maderas',
  templateUrl: './maderas.component.html',
  styleUrls: ['./maderas.component.scss'],
})
export class MaderasComponent implements OnInit, AfterViewInit, IDataContainer {
  grupoFustalList: GrupoFustal[];
  grupoLatizalList: GrupoLatizal[];
  grupoMontebravoList: GrupoMontebravo[];

  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];

  dataSourceFustal: MatTableDataSource<any>;
  dataSourceLatizal: MatTableDataSource<any>;
  dataSourceMontebravo: MatTableDataSource<any>;

  selectionFustal = new SelectionModel<any>(true, []);
  selectionLatizal = new SelectionModel<any>(true, []);
  selectionMontebravo = new SelectionModel<any>(true, []);

  elementsFustal: number = 0;
  elementsLatizal: number = 0;
  elementsMontebravo: number = 0;

  isLoading1 = true;
  isLoading2 = true;
  isLoading3 = true;

  openAccordion: string = "fustal";

  @ViewChild("tableLatizal", { static: false }) tableLatizal: ElementRef;
  @ViewChild("tableFustal", { static: false }) tableFustal: ElementRef;
  @ViewChild("tableMontebravo", { static: false }) tableMontebravo: ElementRef;
  data: any;
  especiesList: import("c:/Users/anton/git/econosinami-ionic/econosinami/src/entities/Especies").Especie[];

  constructor(private recursosService: RecursosService, private appservice: AppService,
    private translate: TranslateService, private uiService: UiService) {

  }


  ngAfterViewInit(): void {

  }

  ngOnInit() { this.refreshData(); }

  refreshData() {
    this.getGrupoFustal();
    this.getGrupoLatizal();
    this.getGrupoMontebravo();
  }

  async open(tipo: string, element?: GrupoFustal | GrupoLatizal | GrupoMontebravo) {
    const message = await this.checkExistingData();
    if (message === null) {
      let titulo = "";

      let translateString = (tipo === 'fustal') ? 'Zona fustal' :
        (tipo === 'latizal') ? 'Zona latizal' : 'Zona montebravo';

      if (element === undefined) {
        if (tipo === 'fustal') {
          element = new GrupoFustal(this.lastIdFustal());
        } else if (tipo === 'latizal') {
          element = new GrupoLatizal(this.lastIdLatizal());
        } else {
          element = new GrupoMontebravo(this.lastIdMontebravo());
        }
      }

      this.translate.get(translateString).subscribe((res: string) => {
        titulo = res;
        this.loadComponent(titulo, element);
      });
    } else {
      await this.uiService.avisoAlert("Aviso", message, "recursos-naturales/1");
    }
  }

  async checkExistingData() {
    let datos = [];

    // Deben existir especies
    this.especiesList = await firstValueFrom(this.recursosService.getEspeciesList());
    if (this.especiesList.length === 0) {
      datos.push("Especies")
    }

    if (datos.length === 0)
      return null;

    return this.uiService.createMessageAviso(datos);
  }

  loadComponent(titulo: string, element: GrupoFustal | GrupoLatizal | GrupoMontebravo) {
    this.appservice.loadComponent(new ContainerItem(MaderaDataComponent, {
      madera: element,
      especiesList: this.especiesList,
      titleComponent: titulo,
      isMainComponent: false,
      helpText: 'maderaDataHelpText'
    }), this.appservice.getRefCurrentDynamicComponent())
  }


  getGrupoFustal() {
    this.recursosService.getGruposFustalList().subscribe((items) => {
      this.grupoFustalList = items;
      this.dataSourceFustal = new MatTableDataSource<GrupoFustal>(this.grupoFustalList);
      this.elementsFustal = items.length;
      this.isLoading1 = false;
    });
  }

  getGrupoLatizal() {
    this.recursosService.getGruposLatizalList().subscribe((items) => {
      this.grupoLatizalList = items;
      this.dataSourceLatizal = new MatTableDataSource<GrupoLatizal>(this.grupoLatizalList);
      this.elementsLatizal = items.length;
      this.isLoading2 = false;
    });
  }

  getGrupoMontebravo() {
    this.recursosService.getGruposMontebravoList().subscribe((items) => {
      this.grupoMontebravoList = items;
      this.dataSourceMontebravo = new MatTableDataSource<GrupoMontebravo>(this.grupoMontebravoList);
      this.elementsMontebravo = items.length;
      this.isLoading3 = false;
    });
  }

  lastIdFustal() {
    if (this.grupoFustalList.length !== 0) {
      let length = this.grupoFustalList.length;
      return this.grupoFustalList[length - 1].idGrupoFustal + 1;
    }
    return 1;
  }

  lastIdLatizal() {
    if (this.grupoLatizalList.length !== 0) {
      let length = this.grupoLatizalList.length;
      return this.grupoLatizalList[length - 1].idGrupoLatizal + 1;
    }
    return 1;
  }

  lastIdMontebravo() {
    if (this.grupoMontebravoList.length !== 0) {
      let length = this.grupoMontebravoList.length;
      return this.grupoMontebravoList[length - 1].idGrupoMontebravo + 1;
    }
    return 1;

  }

  isAllSelected(tipo: string): boolean {
    if (tipo === "fustal") {
      return this.isAllSelectedAux(this.dataSourceFustal, this.selectionFustal);
    } else if (tipo === "latizal") {
      return this.isAllSelectedAux(this.dataSourceLatizal, this.selectionLatizal);
    } else {
      return this.isAllSelectedAux(this.dataSourceMontebravo, this.selectionMontebravo);
    }
  }

  isAllSelectedAux(dataSource, selection) {
    if (dataSource === undefined)
      return false;
    const numSelected = selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }



  isSelected(tipo: string): boolean {
    if (tipo === "fustal") {
      return this.isSelectedAux(this.selectionFustal);
    } else if (tipo === "latizal") {
      return this.isSelectedAux(this.selectionLatizal);
    } else {
      return this.isSelectedAux(this.selectionMontebravo);
    }
  }

  isSelectedAux(selection) {
    const numSelected = selection.selected.length;
    return numSelected !== 0;
  }

  masterToggle(tipo: string) {
    if (tipo === "fustal") {
      return this.masterToggleAux(tipo, this.dataSourceFustal, this.selectionFustal);
    } else if (tipo === "latizal") {
      return this.masterToggleAux(tipo, this.dataSourceLatizal, this.selectionLatizal);
    } else {
      return this.masterToggleAux(tipo, this.dataSourceMontebravo, this.selectionMontebravo);
    }

  }

  masterToggleAux(tipo, dataSource, selection) {
    this.isAllSelected(tipo) ?
      selection.clear() :
      dataSource.data.forEach(row => selection.select(row));
  }

  checkboxLabelFustal(row?: GrupoFustal): string {
    if (!row) {
      return `${this.isAllSelected("fustal") ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionFustal.isSelected(row) ? 'deselect' : 'select'} row ${row.idGrupoFustal + 1}`;
  }

  checkboxLabelLatizal(row?: GrupoLatizal): string {
    if (!row) {
      return `${this.isAllSelected("latizal") ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionLatizal.isSelected(row) ? 'deselect' : 'select'} row ${row.idGrupoLatizal + 1}`;
  }

  checkboxLabelMontebravo(row?: GrupoMontebravo): string {
    if (!row) {
      return `${this.isAllSelected("montebravo") ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionMontebravo.isSelected(row) ? 'deselect' : 'select'} row ${row.idGrupoMontebravo + 1}`;
  }


  delete(tipo: string) {
    if (tipo === "fustal") {
      const selectedLen = this.selectionFustal.selected.length;
      let count = 0;
      this.selectionFustal.selected.forEach(element => {
        this.recursosService.deleteGrupoFustal(element).subscribe(result => {
          count++
          if (count === selectedLen) {
            this.uiService.presentToast("Mensaje borrado");
            this.refreshData();
          }
        })
      });
    } else if (tipo === "latizal") {
      const selectedLen = this.selectionLatizal.selected.length;
      let count = 0;
      this.selectionLatizal.selected.forEach(element => {
        this.recursosService.deleteGrupoLatizal(element).subscribe(result => {
          count++
          if (count === selectedLen) {
            this.uiService.presentToast("Mensaje borrado");
            this.refreshData();
          }
        })
      });
    } else {
      const selectedLen = this.selectionMontebravo.selected.length;
      let count = 0;
      this.selectionMontebravo.selected.forEach(element => {
        this.recursosService.deleteGrupoMontebrevo(element).subscribe(result => {
          count++
          if (count === selectedLen) {
            this.uiService.presentToast("Mensaje borrado");
            this.refreshData();
          }
        })
      });
    }
  }
}
