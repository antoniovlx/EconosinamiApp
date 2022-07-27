import { Component, Input, OnInit } from '@angular/core';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';
import { Cnvr } from 'src/entities/Cnvr';
import { GrupoCnvr } from 'src/entities/GrupoCnvr';

@Component({
  selector: 'app-cnvr-data',
  templateUrl: './cnvr-data.component.html',
  styleUrls: ['./cnvr-data.component.scss'],
})
export class CnvrDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  cnvr: Cnvr;
  grupoCnvr: GrupoCnvr;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private appService: AppService, public utilService: UtilService) { }


  ngOnInit() {
    this.grupoCnvr = this.data.grupoCnvr;
    this.cnvr = this.data.cnvrList[this.data.indexCnvr];
    this.setButtons();
  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Aceptar", action: "aceptar", icon: "done", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  aceptar(){
    this.data.cnvrList[this.data.indexCnvr] = this.cnvr;
    this.appService.goPrev({ cnvrList: this.data.cnvrList})
  }

}
