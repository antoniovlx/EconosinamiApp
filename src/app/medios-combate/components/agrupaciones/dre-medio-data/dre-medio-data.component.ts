import { Component, Input, OnInit } from '@angular/core';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { Dre } from 'src/entities/Dre';

@Component({
  selector: 'app-dre-medio-data',
  templateUrl: './dre-medio-data.component.html',
  styleUrls: ['./dre-medio-data.component.scss'],
})
export class DreMedioDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  dre: Dre;
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private mediosService: MediosService, private appService: AppService, public uiService: UiService) { }

  ngOnInit() {
    this.dre = this.data.dre;
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.dre.dre === undefined || this.dre.dre === '') {
      return true;
    }

    if (this.dre.descripcion === undefined || this.dre.descripcion === '') {
      return true;
    }

    return false;
  }

  guardar(){
    this.unSaved = false;

    this.mediosService.saveOrUpdateDreMedios(this.dre).subscribe(result =>{
      this.uiService.presentToast("Mensaje guardado");
      this.appService.goPrev();
    })
  }

  cancelar(){
    this.appService.goPrev();
  }
}
