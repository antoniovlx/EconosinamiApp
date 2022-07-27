import { Component, Input, OnInit } from '@angular/core';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Arf } from 'src/entities/Arf';
import { Fdr } from 'src/entities/Fdr';

@Component({
  selector: 'app-filosofia-data',
  templateUrl: './filosofia-data.component.html',
  styleUrls: ['./filosofia-data.component.scss'],
})
export class FilosofiaDataComponent extends TableClass implements OnInit, IDataContainer {
  @Input()
  data: any;

  fdr: Fdr;
  arfList: Arf[];
  displayedColumns: string[] = ['categoria', 'cantidad1', 'cantidad2',
    'cantidad3', 'cantidad4', 'cantidad5', 'cantidad6'];
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private appService: AppService, private ejecucionService: EjecucionService, private uiService: UiService) {
    super();
  }

  ngOnInit() {
    this.fdr = this.data.fdr;

    this.refreshData();
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "close", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "confirm", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.fdr.fdr === undefined || this.fdr.fdr === '') {
      return true;
    }

    if (this.fdr.descripcion === undefined || this.fdr.descripcion === '') {
      return true;
    }

    return false;
  }

  refreshData() {
    this.ejecucionService.getArfByFdr(this.fdr.idFdr).subscribe(arfList => {
      this.arfList = arfList;
        this.data.agrupaciones.forEach(dre => {
          const index = this.arfList.findIndex(arf => arf.idDre.idDre == dre.idDre)
          if (index == -1) {
            this.arfList.push(new Arf(dre, this.fdr))
          }
        });
    });
  }

  close() {
    this.appService.goPrev();
  }

  confirm() {
    this.unSaved = false;

    this.ejecucionService.saveOrUpdateFdr(this.fdr).subscribe(result => {
      this.arfList.forEach(arf => {
        this.ejecucionService.saveOrUpdateArf(arf).subscribe();
      });
    });

    this.uiService.presentToast("Mensaje guardado");
    this.appService.goPrev();
  }

}
