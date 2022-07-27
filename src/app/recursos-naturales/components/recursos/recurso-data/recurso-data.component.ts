import { Component, Input, OnInit } from '@angular/core';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { Fustal } from 'src/entities/Fustal';
import { RecursosForestales } from 'src/entities/RecursosForestales';

@Component({
  selector: 'recurso-data',
  templateUrl: './recurso-data.component.html',
  styleUrls: ['./recurso-data.component.scss'],
})
export class RecursoDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  recurso: RecursosForestales;
  unSaved: boolean;

  tipoRecurso: string;


  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private appService: AppService, private uiService: UiService, private recursosService: RecursosService) { }

  ngOnInit() {
    this.recurso = this.data.recurso;
    this.setButtons();
  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.recurso.periodoPosterior === undefined || this.recurso.periodoPosterior.toString() === '') {
      return true;
    }

    if (this.recurso.descripcion === undefined || this.recurso.descripcion === '') {
      return true;
    }

    return false;
  }

  updateTipo(event) {
    this.tipoRecurso = event.detail.value;
  }

  cancelar() {
    this.appService.goPrev();
  }

  guardar() {
    this.unSaved = false;
    
    this.recursosService.saveOrUpdateRecursos(this.recurso).subscribe(result => {
      this.uiService.presentToast("Mensaje guardado");
      this.appService.goPrev();
    })
  }

}
