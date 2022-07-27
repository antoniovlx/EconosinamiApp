import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { CanComponentDeactivate } from 'src/app/services/can-deactivate-guard.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Especie } from 'src/entities/Especies';

@Component({
  selector: 'app-especie-data',
  templateUrl: './especie-data.component.html',
  styleUrls: ['./especie-data.component.scss'],
})
export class EspecieDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  especie: Especie;

  unSaved: boolean;

  fustalData = [];
  latizalData = [];
  montebravoData = [];
  displayedColumns: string[] = ['variable', '1anno', '2anno', '3anno', 'valorMedio'];
  valorMedioFustal: number = 0;
  valorMedioLatizal: number = 0;
  valorMedioMontebravo: number = 0;

  buttons = {
    refComponent: this,
    buttons: []
  }
  
  constructor(private appService: AppService, private uiService: UiService, public util: UtilService, private recursoService:RecursosService) {

  }

  ngOnInit() {
    this.especie = this.data.especie;

    this.calcularValorMedioFustal();
    this.calcularValorMedioLatizal();
    this.calcularValorMedioMontebravo();
    this.setButtons();
  }


  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
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

  calcularValorMedioFustal() {
    this.valorMedioFustal = this.recursoService.calcularValorMedioFustal(this.especie);
  }

  calcularValorMedioLatizal() {
   this.valorMedioLatizal = this.recursoService.calcularValorMedioLatizal(this.especie);
  }

  calcularValorMedioMontebravo() {
    this.valorMedioMontebravo = this.recursoService.calcularValorMedioMontebravo(this.especie);
  }

  cancelar(){
    this.appService.goPrev();
  }

  guardar(){
    this.unSaved = false;

    this.recursoService.saveOrUpdateEspecie(this.especie).subscribe(result =>{
      this.uiService.presentToast("Mensaje guardado");
      this.appService.goPrev();
    })
  }

}
