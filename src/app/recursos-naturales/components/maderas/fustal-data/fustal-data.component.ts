import { Component, Input, OnInit } from '@angular/core';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Especie } from 'src/entities/Especies';
import { Fustal } from 'src/entities/Fustal';
import { GrupoFustal } from 'src/entities/GrupoFustal';

@Component({
  selector: 'app-fustal-data',
  templateUrl: './fustal-data.component.html',
  styleUrls: ['./fustal-data.component.scss'],
})
export class FustalDataComponent extends TableClass implements OnInit, IDataContainer {
  @Input()
  data: any;

  fustal: Fustal;
  zonaMadera: GrupoFustal;

  displayedColumns: string[] = ['intensidad', 'mortalidad', 'noExtraido'];
  especie: Especie;
  valorMedioFustal: number = 0;
  especieName: string = '';

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(public utilService: UtilService, private recursosService: RecursosService, private appService: AppService) {
    super();
  }


  ngOnInit() {
    this.fustal = this.data.fustal;
    this.zonaMadera = this.data.zonaMadera;

    this.especie = this.fustal.idEspecie;
    this.especieName = "(" + this.data.fustal.idEspecie.especie + ") " + this.data.fustal.idEspecie.descripcion
    this.valorMedioFustal = this.recursosService.calcularValorMedioFustal(this.especie);
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
    this.appService.goPrev({fustal: this.fustal});
  }
}
