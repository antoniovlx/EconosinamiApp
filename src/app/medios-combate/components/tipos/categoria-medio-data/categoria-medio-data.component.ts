import { Component, Input, OnInit } from '@angular/core';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';

@Component({
  selector: 'app-categoria-medio-data',
  templateUrl: './categoria-medio-data.component.html',
  styleUrls: ['./categoria-medio-data.component.scss'],
})
export class CategoriaMedioDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  categoria: CategoriaMedios;
  
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private appService: AppService, private mediosService: MediosService, public uiService: UiService) { }

  ngOnInit() {
    this.categoria = this.data.categoria;
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.categoria.categoriaMedios === undefined || this.categoria.categoriaMedios === '') {
      return true;
    }

    if (this.categoria.categoriaMedios === undefined || this.categoria.categoriaMedios === '') {
      return true;
    }

    return false;
  }

  guardar(){
    this.unSaved = false;

    this.mediosService.saveOrUpdateCategoriaMedios(this.categoria).subscribe(result =>{
      this.uiService.presentToast("Mensaje guardado");
      this.appService.goPrev();
    })
  }

  cancelar(){
    this.appService.goPrev();
  }

}
