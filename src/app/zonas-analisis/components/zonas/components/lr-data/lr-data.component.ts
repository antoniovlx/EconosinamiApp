import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';
import { MapaService } from 'src/app/shared/services/mapa.service';
import { TableClass } from 'src/app/shared/tableClass';
import { Configuracion } from 'src/entities/Configuracion';
import { Distancias } from 'src/entities/Distancias';
import { Lr } from 'src/entities/Lr';
import { ZonasService } from '../../services/zonas.service';

@Component({
  selector: 'lr-data',
  templateUrl: './lr-data.component.html',
  styleUrls: ['./lr-data.component.scss'],
})
export class LrDataComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  lr: Lr;
  distancias: Distancias[] = [];
  configuracion: Configuracion;

  lat: number;
  lon: number;

  displayedColumns: string[] = ['descripcion', 'kilometros'];

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private zonasService: ZonasService, private appService: AppService, private mapaService: MapaService, public util: UtilService) {
    super();
  }

  @Input() data: any;

  ngOnInit() {
    this.lr = this.data.lr;

    this.configuracion = this.util.getConfiguracionData();
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Aceptar", action: "aceptar", icon: "done", class: "green-icon", disabled: this.isDisabled() });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  setAviso() {
    this.appService.setAvisoChanged$({ mensaje: "Antes de continuar, debe introducir la ubicación de las bases", link: '../medios-combate' });
  }

  isDisabled() {
    if (this.lr.lr === undefined || this.lr.lr === '') {
      return true;
    }

    if (this.lr.descripcion === undefined || this.lr.descripcion === '') {
      return true;
    }

    return false;
  }

  ngAfterViewInit(): void {
    this.distancias = this.lr.distancias;

    if (this.distancias === undefined) {
      this.distancias = [];
    }

    let bases = this.data.bases;
    for (const base of bases) {
      const index = this.distancias.findIndex(distancia => distancia.idBase.idBase == base.idBase)

      if (index === -1) {
        let distancia = new Distancias();
        distancia.idBase = base;
        this.distancias.push(distancia);
      }
    }
    this.isLoading = false;
  }

  aceptar(): void {
    this.appService.goPrev({ lr: this.lr });
  }

  updateLatLon() {
    if (this.lat != undefined && this.lon != undefined) {
      var utm = this.mapaService.convertToUtm(this.lat, this.lon);
      this.data.x = parseFloat(utm[0].toFixed(0));
      this.data.y = parseFloat(utm[1].toFixed(0));
    }
  }

  updateUtm() {
    var utmx = this.lr.x.toString();
    var utmy = this.lr.y.toString();
    if (utmx != "" && utmx != undefined && utmy != "" && utmy != undefined) {
      var coord = this.mapaService.convertToLatLng(utmx, utmy, this.configuracion.husoUtm);
      this.lat = parseFloat(coord.lat.toFixed(6));
      this.lon = parseFloat(coord.lng.toFixed(6));
    }
  }


}
