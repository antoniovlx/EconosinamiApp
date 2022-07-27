import { Component, Input, OnInit } from '@angular/core';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Especie } from 'src/entities/Especies';
import { GrupoMontebravo } from 'src/entities/GrupoMontebravo';
import { Montebravo } from 'src/entities/Montebravo';

@Component({
  selector: 'app-montebravo-data',
  templateUrl: './montebravo-data.component.html',
  styleUrls: ['./montebravo-data.component.scss'],
})
export class MontebravoDataComponent extends TableClass implements OnInit, IDataContainer {
  @Input()
  data: any;

  montebravo: Montebravo;
  zonaMadera: GrupoMontebravo;

  displayedColumns: string[] = ['intensidad', '25%-75%', '>75%'];
  valorMedioMontebravo: number = 0;
  especie: Especie;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(public utilService: UtilService, private recursosService: RecursosService, private appService: AppService) {
    super();
  }


  ngOnInit() {
    this.montebravo = this.data.montebravo;
    this.zonaMadera = this.data.zonaMadera;

    this.especie = this.montebravo.idEspecie;
    this.valorMedioMontebravo = this.recursosService.calcularValorMedioMontebravo(this.especie);
    this.setButtons();
  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Aceptar", action: "aceptar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

    isDisabled() {
    if (this.especie.especie === undefined || this.especie.especie === '') {
      return true;
    }

    if (this.especie.descripcion === undefined || this.especie.descripcion === '') {
      return true;
    }

    return false;
  }


  aceptar(){
    this.appService.goPrev({montebravo: this.montebravo});
  }

}
