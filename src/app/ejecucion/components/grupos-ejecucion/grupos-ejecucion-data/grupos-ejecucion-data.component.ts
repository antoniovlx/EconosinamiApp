import { Component, Input, OnInit } from '@angular/core';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { GruposEjecucion } from 'src/entities/GruposEjecucion';

@Component({
  selector: 'app-grupos-ejecucion-data',
  templateUrl: './grupos-ejecucion-data.component.html',
  styleUrls: ['./grupos-ejecucion-data.component.scss'],
})
export class GruposEjecucionDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  grupoEjecucion: GruposEjecucion;
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private appService: AppService, private ejecucionService: EjecucionService, private uiService: UiService) { }
 
  ngOnInit() {
    this.grupoEjecucion = this.data.grupoEjecucion;
    this.appService.setActionButtonsChanged$([]);
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "close", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "confirm", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.grupoEjecucion.grupoEjecucion === undefined || this.grupoEjecucion.grupoEjecucion === '') {
      return true;
    }

    if (this.grupoEjecucion.descripcion === undefined || this.grupoEjecucion.descripcion === '') {
      return true;
    }

    return false;
  }

  close(){
    this.appService.goPrev();
  }

  confirm(){
    this.unSaved = false;

    this.ejecucionService.saveGrupoEjecucion(this.grupoEjecucion).subscribe(result => {
      this.uiService.presentToast("Mensaje guardado");
      this.appService.goPrev();
    });
  }
}
