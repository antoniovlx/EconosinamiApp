import { Component, Input, OnInit } from '@angular/core';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Especie } from 'src/entities/Especies';
import { GrupoLatizal } from 'src/entities/GrupoLatizal';
import { Latizal } from 'src/entities/Latizal';

@Component({
  selector: 'app-latizal-data',
  templateUrl: './latizal-data.component.html',
  styleUrls: ['./latizal-data.component.scss'],
})
export class LatizalDataComponent extends TableClass implements OnInit, IDataContainer {
  @Input()
  data: any;

  latizal: Latizal;
  zonaMadera: GrupoLatizal;

  displayedColumns: string[] = ['intensidad', '25%-75%', '>75%'];
  valorMedioLatizal: number = 0;
  especie: Especie;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(public utilService: UtilService, private recursosService: RecursosService, private appService: AppService) {
    super();
  }


  ngOnInit() {
    this.latizal = this.data.latizal;
    this.zonaMadera = this.data.zonaMadera;

    this.especie = this.latizal.idEspecie;
    this.valorMedioLatizal = this.recursosService.calcularValorMedioLatizal(this.especie);
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
    this.appService.goPrev({latizal: this.latizal});
  }

}
