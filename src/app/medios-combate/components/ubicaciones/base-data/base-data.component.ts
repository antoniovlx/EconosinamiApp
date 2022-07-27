import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { MapaComponent } from 'src/app/shared/components/mapa/mapa.component';
import { MapaService } from 'src/app/shared/services/mapa.service';
import { Bases } from 'src/entities/Bases';
import { Configuracion } from 'src/entities/Configuracion';

@Component({
  selector: 'app-base-data',
  templateUrl: './base-data.component.html',
  styleUrls: ['./base-data.component.scss'],
})
export class BaseDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  base: Bases;

  @ViewChild(MapaComponent, { static: false })
  private mapComponent: MapaComponent;

  lat: number = 0;
  lon: number = 0;
  utmx: number = 0;
  utmy: number = 0;
  configuracion: Configuracion;
  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(
    private mapaService: MapaService, public util: UtilService, private uiService: UiService,
    private appService: AppService, private mediosService: MediosService) { }

  ngOnInit() {
    this.configuracion = this.util.getConfiguracionData();
    this.base = this.data.base;

    this.utmx = this.base.x;
    this.utmy = this.base.y;
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "cancelar", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "guardar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  isDisabled() {
    if (this.base.base === undefined || this.base.base === '') {
      return true;
    }

    if (this.base.descripcion === undefined || this.base.descripcion === '') {
      return true;
    }

    return false;
  }

  refreshMap() {
    this.mapaService.clearMarkers(this.mapComponent.get());
    this.mapaService.setCenter(this.mapComponent.get(), this.utmx, this.utmy, this.configuracion.husoUtm, 13)
    this.mapaService.addUtmMarker(this.mapComponent.get(), this.utmx, this.utmy, this.configuracion.husoUtm);
    this.mapaService.invalidateSize(this.mapComponent.get());
  }

  updateLatLon() {
    if (this.lat != undefined && this.lon != undefined) {
      var utm = this.mapaService.convertToUtm(this.lat, this.lon);
      this.utmx = parseFloat(utm[0].toFixed(0));
      this.utmy = parseFloat(utm[1].toFixed(0));
      this.refreshMap();
    }
  }

  updateUtm() {
    var utmx = this.utmx.toString();
    var utmy = this.utmy.toString();
    if (utmx != "" && utmx != undefined && utmy != "" && utmy != undefined) {
      var coord = this.mapaService.convertToLatLng(utmx, utmy, this.configuracion.husoUtm);
      this.lat = parseFloat(coord.lat.toFixed(6));
      this.lon = parseFloat(coord.lng.toFixed(6));
      this.refreshMap();
    }
  }

  ngAfterViewInit(): void {
    this.updateUtm();
  }

  guardar() {
    this.unSaved = false;

    this.base.x = this.utmx;
    this.base.y = this.utmy;

    this.mediosService.saveOrUpdateBases(this.base).subscribe(result => {
      this.uiService.presentToast("Mensaje guardado");
      this.appService.goPrev();
    })
  }

  cancelar() {
    this.appService.goPrev();
  }
}
