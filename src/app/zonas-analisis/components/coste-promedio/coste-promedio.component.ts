import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { error } from 'console';
import { firstValueFrom } from 'rxjs';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Cph } from 'src/entities/Cph';
import { Cphlr } from 'src/entities/Cphlr';
import { Lr } from 'src/entities/Lr';
import { Zamif } from 'src/entities/Zamif';
import { ZonasService } from '../zonas/services/zonas.service';

@Component({
  selector: 'app-coste-promedio',
  templateUrl: './coste-promedio.component.html',
  styleUrls: ['./coste-promedio.component.scss'],
})
export class CostePromedioComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {


  displayedColumns: string[] = ['tamannoHa', 'costeHa'];

  zamifList: Zamif[] = [];
  idZamifSelected: number;
  zamifSelected: Zamif;

  lrList: Lr[] = [];
  lrSelected: Lr;
  idLrSelected: number;

  @ViewChildren(MatTable) table !: QueryList<MatTable<any>>;

  cphsData: Cph[] = [];
  cphslrData: Cphlr[] = [];

  @Input()
  data: any;

  constructor(private appservice: AppService, private zonasService: ZonasService, private uiService: UiService, public util: UtilService) {
    super();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.zamifList = this.data.zamifList;
    this.idZamifSelected = this.zamifList[0].idZamif;
    this.zamifSelected = this.zamifList[0];

    this.refreshLr();
    this.getCostesZamif();
  }

  getCostesZamif() {
    this.zonasService.getCphsByZamif(this.idZamifSelected).subscribe(costes => {
      if (costes.length === 0) {
        this.initCph();
      } else {
        this.cphsData = costes;
      }
      this.isLoading = false;
    });
  }
  initCph() {
    this.cphsData = [];
    this.cphsData.push(
      new Cph(this.zamifSelected, 1),
      new Cph(this.zamifSelected, 5),
      new Cph(this.zamifSelected, 10),
      new Cph(this.zamifSelected, 20),
      new Cph(this.zamifSelected, 25),
      new Cph(this.zamifSelected, 50),
      new Cph(this.zamifSelected, 100));
  }

  getCostesLr() {
    this.zonasService.getCphlrByLr(this.idLrSelected).subscribe(costes => {
      if (costes.length === 0) {
        this.cphslrData = [];
        this.cphslrData.push(
          new Cphlr(this.idLrSelected, 1),
          new Cphlr(this.idLrSelected, 5),
          new Cphlr(this.idLrSelected, 10),
          new Cphlr(this.idLrSelected, 20),
          new Cphlr(this.idLrSelected, 25),
          new Cphlr(this.idLrSelected, 50),
          new Cphlr(this.idLrSelected, 100))
      } else {
        this.cphslrData = costes;
      }
    });
  }

  addCph() {
    this.cphsData.push(new Cph(this.zamifSelected, 0));
    this.table.first.renderRows();
  }

  async removeCph() {
    let continuar = true;

    const confirm = await this.uiService.confirmationAlert("Confirmación",
      "¿Desea CONTINUAR y eliminar los elementos seleccionados?");

    if (confirm) {
      continuar = true;
    } else {
      continuar = false;
    }

    if (continuar) {
      this.cphsData = this.cphsData.slice(0, this.cphsData.length - 1);
      this.table.first.renderRows();
    }
  }

  addCphlr() {
    this.cphslrData.push(new Cphlr(this.idLrSelected, 0))
    this.table.last.renderRows();
  }

  async removeCphlr() {
    let continuar = true;

    const confirm = await this.uiService.confirmationAlert("Confirmación",
      "¿Desea CONTINUAR y eliminar los elementos seleccionados?");

    if (confirm) {
      continuar = true;
    } else {
      continuar = false;
    }

    if (continuar) {
      this.cphslrData = this.cphslrData.slice(0, this.cphslrData.length - 1);
      this.table.first.renderRows();
    }
  }

  refreshLr() {
    if (this.zamifSelected.lrs.length !== 0) {
      this.lrList = this.zamifSelected.lrs;
      this.lrSelected = this.lrList[0];
      this.idLrSelected = this.lrSelected.idLr
      this.getCostesLr();
    } else {
      this.lrList = [];
      this.cphslrData = [];
    }
  }

  updateZamif(id: number) {
    this.zamifSelected = this.zamifList.filter(zamif => zamif.idZamif === id)[0];
    this.idZamifSelected = id;
    this.getCostesZamif();
    this.refreshLr();
  }

  updateLr(id: number) {
    this.lrSelected = this.lrList.filter(lr => lr.idLr === id)[0];
    this.idLrSelected = id;
    this.getCostesLr();
  }

  async updateCostesZamif() {
    this.cphsData[0].baseAnterior = 0;
    this.cphsData[0].sobreHectareas = 0;
    for (let i = 1; i < this.cphsData.length; i++) {
      this.cphsData[i].baseAnterior = this.cphsData[i - 1].hastaHectareas * (this.cphsData[i - 1].costo + this.cphsData[i].costo) / 2;
      this.cphsData[i].sobreHectareas = this.cphsData[i - 1].hastaHectareas;
    }

    for (let i = 0; i < this.cphsData.length - 1; i++) {
      this.cphsData[i].incHectarea = (this.cphsData[i + 1].baseAnterior - this.cphsData[i].baseAnterior) / (this.cphsData[i].hastaHectareas - this.cphsData[i].sobreHectareas);
      this.cphsData[this.cphsData.length - 1].incHectarea = this.cphsData[this.cphsData.length - 1].costo;
    }

    // delete all cph by zamif before save
    this.zonasService.deleteCphByZamif(this.idZamifSelected).subscribe(
      result => {
        for (const cph of this.cphsData) {
          const that = this;
          this.zonasService.saveOrUpdateCph(cph)
            .subscribe({
              error(err) {
                that.uiService.presentAlertToast(err);
              }
            });
        }
        this.uiService.presentToast("Mensaje guardado")
      }
    );
  }

  updateCostesLr() {
    this.cphslrData[0].baseAnterior = 0;
    this.cphslrData[0].sobreHectareas = 0;
    for (let i = 1; i < this.cphslrData.length; i++) {
      this.cphslrData[i].baseAnterior = this.cphslrData[i - 1].hastaHectareas * (this.cphslrData[i - 1].costo + this.cphslrData[i].costo) / 2;
      this.cphslrData[i].sobreHectareas = this.cphslrData[i - 1].hastaHectareas;
    }

    for (let i = 0; i < this.cphslrData.length - 1; i++) {
      this.cphslrData[i].incHectarea = (this.cphslrData[i + 1].baseAnterior - this.cphslrData[i].baseAnterior) / (this.cphslrData[i].hastaHectareas - this.cphslrData[i].sobreHectareas);
      this.cphslrData[this.cphslrData.length - 1].incHectarea = this.cphslrData[this.cphslrData.length - 1].costo;
    }

    for (const cphlr of this.cphslrData) {
      const that = this;
      this.zonasService.saveOrUpdateCphlr(cphlr).subscribe({
        error(err) {
          that.uiService.presentAlertToast(err);
        }
      });
    }
    this.uiService.presentToast("Mensaje guardado")
  }

}
