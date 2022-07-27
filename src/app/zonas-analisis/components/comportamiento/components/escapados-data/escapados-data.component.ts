import { Component, Input, OnInit } from '@angular/core';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Dcflr } from 'src/entities/Dcflr';
import { Lr } from 'src/entities/Lr';
import { ZonasService } from '../../../zonas/services/zonas.service';

@Component({
  selector: 'app-escapados-data',
  templateUrl: './escapados-data.component.html',
  styleUrls: ['./escapados-data.component.scss'],
})
export class EscapadosDataComponent extends TableClass implements OnInit, IDataContainer {

  @Input()
  data: any;
  
  displayedColumns: string[] = ['intensidad', '50perc', '90perc'];
  dcflrsSelected: Dcflr[] = [];
  dcflrsAll: Dcflr[] = [];

  lrList: Lr[] = [];
  lrSelected: Lr;
  idLrSelected: number;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private zonasService: ZonasService, private uiService: UiService, private appService: AppService) {
    super();
  }

  ngOnInit(): void {
    this.setButtons();
    this.zonasService.getLugaresRepresentativosByZamif(this.data.idZamif).subscribe(lrs => {
      this.lrList = lrs;
      if (this.lrList.length === 0) {
        this.uiService.presentAlertToast('FALTA LR');
      } else {
        // lr seleccionado por defecto (el primero)
        this.lrSelected = this.lrList[0];
        this.idLrSelected = this.lrList[0].idLr;

        if (this.data.dcflrs.length !== 0) {
          this.dcflrsAll = this.data.dcflrs;
          this.dcflrsSelected = this.dcflrsAll.filter(dcflr => dcflr.idLr.idLr === this.idLrSelected);

          // el lr seleccionado no 
          if (this.dcflrsSelected.length === 0) {
            this.getData(this.lrSelected);
          }
        } else {
          this.lrList.forEach(lr => {
            this.getData(lr);
          });
        }
      }
      this.isLoading = false;
    });

  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Aceptar", action: "aceptar", icon: "done", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  getData(lr: Lr) {
    this.zonasService.getDcflrsByGfcdAndLr(this.data.gdcf.idGdcf, lr.idLr).subscribe((items) => {
      this.dcflrsAll = this.dcflrsAll.concat(items);

      if (items.length === 0)
        this.initData(lr);

      this.dcflrsSelected = this.dcflrsAll.filter(dcflr => dcflr.idLr.idLr === this.idLrSelected);
    });
  }

  initData(lr: Lr) {
      // init array dcf
      this.dcflrsAll.push(
        new Dcflr(1, lr, this.data.gdcf, 0, 0),
        new Dcflr(2, lr, this.data.gdcf, 0, 0),
        new Dcflr(3, lr, this.data.gdcf, 0, 0),
        new Dcflr(4, lr, this.data.gdcf, 0, 0),
        new Dcflr(5, lr, this.data.gdcf, 0, 0),
        new Dcflr(6, lr, this.data.gdcf, 0, 0),
      );
    }

  updateLr(id: number) {
      const index = this.dcflrsAll.findIndex(dcf => dcf.idLr.idLr === id);
      this.idLrSelected = id;

      // no está añadido
      if(index === -1){
        this.initData(this.lrSelected);
      }
      
      this.dcflrsSelected = this.dcflrsAll.filter(dcf => dcf.idLr.idLr === id);
    }

    aceptar(){
      this.appService.goPrev({ dcflrsAll: this.dcflrsAll, dcfAll: this.data.dcfAll});
    }
}
