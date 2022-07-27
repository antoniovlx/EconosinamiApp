import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Cnvr } from 'src/entities/Cnvr';
import { CnvrLr } from 'src/entities/CnvrLr';
import { GrupoCnvr } from 'src/entities/GrupoCnvr';
import { Zamif } from 'src/entities/Zamif';

@Component({
  selector: 'cnvr-lr-data',
  templateUrl: './cnvr-lr-data.component.html',
  styleUrls: ['./cnvr-lr-data.component.scss'],
})
export class CnvrLrDataComponent extends TableClass implements OnInit, IDataContainer {
  @Input()
  data: any;

  zamif: Zamif;
  gruposCnvr: GrupoCnvr[] = [];

  displayedColumns = ["lr", "grupocnvr"];
  cnvrLrList: CnvrLr[] = [];

  @ViewChild(MatTable) table: MatTable<CnvrLr>;
  dataSource: MatTableDataSource<CnvrLr>;
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private uiService: UiService, private recursosService: RecursosService, private appService: AppService) {
    super();
  }


  ngOnInit() {
    this.dataSource = new MatTableDataSource<CnvrLr>([]);

    this.zamif = this.data.zamif;
    this.gruposCnvr = this.data.gruposCnvr;

    for (let index = 0; index < this.zamif.lrs.length; index++) {
      const lr = this.zamif.lrs[index];
      this.recursosService.getCnvrLrByLr(lr.idLr).subscribe(cnvr => {
        if (cnvr.length !== 0) {
          this.cnvrLrList.push(cnvr[0]);
        } else {
          this.cnvrLrList.push(new CnvrLr(lr, new GrupoCnvr(0)));
        }
        this.dataSource.data = this.cnvrLrList;
        this.table.renderRows();
      });
    }
   this.setButtons();
  } 


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }


  guardar() {
    this.unSaved = false;

    this.cnvrLrList.forEach(cnvrlr => {
      this.recursosService.saveOrUpdateCnvrlr(cnvrlr).subscribe();
    });

    this.appService.goPrev();
    this.uiService.presentToast("Mensaje guardado");
  }

  cancelar() {
    this.appService.goPrev();
  }
}
