import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DataEstimacionFuegoAnuales } from 'src/app/informes/modelData';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Dcf } from 'src/entities/Dcf';
import { Dcflr } from 'src/entities/Dcflr';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Zamif } from 'src/entities/Zamif';
import { ZonasService } from '../../../zonas/services/zonas.service';
import { EscapadosDataComponent } from '../escapados-data/escapados-data.component';

@Component({
  selector: 'app-comportamiento-data',
  templateUrl: './comportamiento-data.component.html',
  styleUrls: ['./comportamiento-data.component.scss'],
})
export class ComportamientoDataComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  @Input()
  data: any;

  displayedColumns: string[] = ['intensidad', 'numerofuegos', '50perc', '90perc'];
  zamifList: Zamif[] = [];
  dcfZamifSelected: Dcf;
  idZamifSelected: number;

  dcfAll: Dcf[] = [];
  dcfSelected: Dcf[] = [];

  dcflrsAll: Dcflr[] = [];
  dcflrsSelected: Dcflr[] = [];

  grupoDcf: GruposDcf;

  unSaved: boolean = true;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private appService: AppService, private zonasService: ZonasService, private uiService: UiService) {
    super();
  }

  ngOnInit() {
    this.grupoDcf = this.data.gdcf;
    this.dataSource = new MatTableDataSource<any>([]);
    this.refreshData();
    this.setButtons();
  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.grupoDcf.gdcf === undefined || this.grupoDcf.gdcf.toString() === '') {
      return true;
    }

    if (this.grupoDcf.descripcion === undefined || this.grupoDcf.descripcion === '') {
      return true;
    }

    return false;
  }

  ngAfterViewInit(): void {

  }

  async refreshData() {
    if (this.data.dcflrsAll !== undefined) {
      this.dcflrsAll = this.data.dcflrsAll;
    }
    // get Zamif List
    this.zamifList = this.data.zamifList;
    this.idZamifSelected = this.zamifList[0].idZamif;
    if (this.data.dcfAll !== undefined) {
      this.dcfAll = this.data.dcfAll;
      this.initZamif();
      this.dcfSelected = this.dcfAll.filter(dcf => dcf.idZamif.idZamif === this.zamifList[0].idZamif);
      this.isLoading = false;

    } else {
      this.zonasService.getDcfByGfcd(this.grupoDcf.idGdcf).subscribe((items) => {
        this.dcfAll = items;
        this.initZamif();
        this.dcfSelected = this.dcfAll.filter(dcf => dcf.idZamif.idZamif === this.zamifList[0].idZamif);
        this.isLoading = false;
      });
    }

  }

  initZamif() {
    // init array dcf
    this.zamifList.forEach(zamif => {
      const index = this.dcfAll.findIndex(dcf => dcf.idZamif.idZamif === zamif.idZamif);
      if (index === -1) {
        this.dcfAll.push(
          new Dcf(1, zamif, this.grupoDcf, 0, 0, 0),
          new Dcf(2, zamif, this.grupoDcf, 0, 0, 0),
          new Dcf(3, zamif, this.grupoDcf, 0, 0, 0),
          new Dcf(4, zamif, this.grupoDcf, 0, 0, 0),
          new Dcf(5, zamif, this.grupoDcf, 0, 0, 0),
          new Dcf(6, zamif, this.grupoDcf, 0, 0, 0)
        );
      }
    });
  }

  updateZamif(id: number) {
    this.dcfSelected = this.dcfAll.filter(dcf => dcf.idZamif.idZamif === id);
    //this.zamifSelected = this.zamifList.filter(zamif => zamif.idZamif === id)[0];
    this.idZamifSelected = id;
  }

  cancelar() {
    this.appService.goPrev();
  }

  guardar() {
    this.unSaved = false;

    this.zonasService.saveOrUpdateGdcf(this.grupoDcf).subscribe(result => {
      // update zamif-dcfs
      for (const dcf of this.dcfAll) {
        this.zonasService.saveOrUpdatDcf(dcf).subscribe();
      }
      // update lr-dcflrs
      for (const dcflr of this.dcflrsAll) {
        this.zonasService.saveOrUpdatDcflr(dcflr).subscribe();
      }
    });

    this.uiService.presentToast("Mensaje guardado");
    this.appService.goPrev();
  }

  openEscapados() {
    this.appService.loadComponent(new ContainerItem(EscapadosDataComponent, {
      gdcf: this.grupoDcf,
      idZamif: this.idZamifSelected,
      dcfAll: this.dcfAll,
      dcflrs: this.dcflrsAll,
      titleComponent: "Comportamiento en los fuegos escapados",
      isMainComponent: false,
      helpText: 'escapadosHelpText'
    }), this.appService.getRefCurrentDynamicComponent());
  }
}
