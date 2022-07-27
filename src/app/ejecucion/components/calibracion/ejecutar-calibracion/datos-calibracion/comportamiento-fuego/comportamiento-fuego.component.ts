import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { DataEscapados } from 'src/app/informes/modelData';
import { AppService } from 'src/app/services/app.service';
import { HelperService } from 'src/app/services/helper.service';
import { sZAMIF } from 'src/app/shared/modelData';
import { Dcf } from 'src/entities/Dcf';

@Component({
  selector: 'comportamiento-fuego',
  templateUrl: './comportamiento-fuego.component.html',
  styleUrls: ['./comportamiento-fuego.component.scss'],
})
export class ComportamientoFuegoComponent implements OnInit {

  displayedColumns: string[] = ['intensidad', 'numerofuegos', '50perc', '90perc'];

  @Input()
  dcfAll: Dcf[] = [];

  @Input()
  dataEscapados: DataEscapados[] = [];

  @Input()
  sZamif: sZAMIF;

  @Output() isDcfChanged = new EventEmitter<Dcf[]>();
  @Output() isEscapadosChanged = new EventEmitter<DataEscapados[]>();
  @Output() isSZamifChanged = new EventEmitter<sZAMIF>();

  total: number;

  displayedColumnsEscapados: string[] = ['lugar', 'percentil', 'intensidad1', 'intensidad2', 'intensidad3', 'intensidad4', 'intensidad5', 'intensidad6'];
  aviso: boolean;

  constructor(private appservice: AppService, public helperservice: HelperService, private ejecucionService: EjecucionService) { }

  ngOnInit(): void {
    console.log(this.sZamif)
  }

  calcularTotal() {
    // sumar columna numero de fuegos
    if(this.dcfAll.length !== 0){
      this.total = this.dcfAll.map(dcf => dcf.numFuegos).reduce((a, b) => a + b);
      return this.total.toFixed(2);
    }else{
      return 0;
    }
  }

  calcularHistorico() {
    return this.sZamif.HFT.numFuegosTotal.toFixed(2);
  }

  calcularDiferencia() {
    return (this.total - this.sZamif.HFT.numFuegosTotal).toFixed(2);
  }

  updateDcf() {
    this.isDcfChanged.emit(this.dcfAll);
  }

  updateEscapados() {
    this.isEscapadosChanged.emit(this.dataEscapados);
  }

  updateSZamif(){
    this.isSZamifChanged.emit(this.sZamif);
  }

}
