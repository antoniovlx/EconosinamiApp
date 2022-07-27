import { AfterContentInit, AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { ModelosCombustible } from 'src/entities/ModelosCombustible';
import { RatiosProduccion } from 'src/entities/RatiosProduccion';

@Component({
  selector: 'app-ratios-produccion',
  templateUrl: './ratios-produccion.component.html',
  styleUrls: ['./ratios-produccion.component.scss'],
})
export class RatiosProduccionComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  displayedColumns: string[] = ['modelos', 'velocidad'];

  ratiosList: RatiosProduccion[] = [];

  @ViewChild(MatTable)
  table: MatTable<RatiosProduccion>

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private appService: AppService, private zonasService: ZonasService) { }

  ngOnInit() {
    this.ratiosList = this.data.ratios;
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Aceptar", action: "aceptar", icon: "done", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  aceptar() {
    this.appService.goPrev({ 
      ratios: this.ratiosList, 
      selectedCategoria: this.data.selectedCategoria, 
      selectedAgrupacion: this.data.selectedAgrupacion,
      selectedTipoUnidad: this.data.selectedTipoUnidad });
  }

}
