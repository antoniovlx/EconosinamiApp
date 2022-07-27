import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { Configuracion } from 'src/entities/Configuracion';
import { UiService } from '../services/ui.service';
import { UtilService } from '../services/util.service';
import { AppService } from '../services/app.service';
import { IonContent } from '@ionic/angular';
import { ConfiguracionRepository } from '../repositories/ConfiguracionRepository';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  configuracion: Configuracion;

  monedas = ["Euro (€)", "Dólar ($)", "Peso ($)"]

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private appService: AppService, public utilService: UtilService, public uiService: UiService, 
    private location: Location, private configuracionRepository: ConfiguracionRepository) { }

  
  ngOnInit(): void {
    this.configuracion = this.utilService.configuracion;
    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });
  }

  ngAfterViewInit(): void {
    this.appService.setTitleComponentChanged$({
      titleComponent: "Configuración",
      isMainComponent: true
    });

    this.setButtons();

    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Guardar", action: "updateConfiguracion", icon: "save", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.configuracion.husoUtm === undefined || this.configuracion.husoUtm === null) {
      return true;
    }

    return false;
  }

  updateMoneda(event){
    this.configuracion.moneda = event.detail.value;
  }


  updateConfiguracion() {
    if(this.configuracion.husoUtm > 1 && this.configuracion.husoUtm < 60){
      this.configuracionRepository.saveOrUpdateConfiguration(this.configuracion).subscribe();
      this.uiService.presentToast("Mensaje guardado")
    }else{
      this.uiService.presentAlertToast("Aviso huso")
    }
  }

  goPrev(){
    this.location.back();
  }
}
