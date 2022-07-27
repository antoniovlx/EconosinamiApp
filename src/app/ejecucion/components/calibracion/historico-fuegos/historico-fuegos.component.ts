import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { HistoricoFuegos } from 'src/entities/HistoricoFuegos';
import { Zamif } from 'src/entities/Zamif';

@Component({
  selector: 'app-historico-fuegos',
  templateUrl: './historico-fuegos.component.html',
  styleUrls: ['./historico-fuegos.component.scss'],
})
export class HistoricoFuegosComponent implements OnInit {
  displayedColumns: string[] = ['tamano fuegos', 'numero fuegos', 'superficie quemada', 'coste estimado'];

  tamannos = ['< 0.1', '0.1 - 3.99', '4 - 39.99', '40 - 119.99', '120 - 399.99', '>= 400']

  lastSelectedZamif: number;
  selectedZamif: number;
  zamifList: Zamif[];

  historicoData: HistoricoFuegos[];

  @ViewChild(MatSelect) matSelect: MatSelect;
  isChanged: boolean = false;

  count: number = 0;

  @Output() dataChanged = new EventEmitter<boolean>();
  moneda: { moneda: string; };

  @ViewChild(MatTable) table: MatTable<HistoricoFuegos>;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private ejecucionService: EjecucionService,
    private zonasService: ZonasService, private uiService: UiService,
    public utilService: UtilService, public appService: AppService) { }

  ngOnInit() {
    this.zonasService.getAllZamif().subscribe(async values => {
      if(values.length !== 0){
        this.zamifList = values;
        this.selectedZamif = this.zamifList[0].idZamif;
        this.lastSelectedZamif = this.selectedZamif;
  
        this.refreshData();
      }else{
        await this.uiService.avisoAlert("Aviso", "Deben existir zonas de análisis (Zamif)", "zonas-analisis");
      }
    })
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Grabar", action: "guardar", icon: "build", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  refreshData() {
    this.ejecucionService.getHistoricoFuegos(this.selectedZamif).subscribe(result => {
      if (result.length !== 0) {
        this.historicoData = result;
      } else {
        this.historicoData = [];
        for (let index = 1; index <= this.tamannos.length; index++) {
          const element = this.tamannos[index];
          this.historicoData.push(new HistoricoFuegos(index));
        }
        this.table.renderRows();
      }
    })
  }


  updateZamifList(idZamif: number) {
    this.selectedZamif = idZamif;
    this.dataChanged.emit(false);
    this.refreshData();
  }

  guardar() {
    this.ejecucionService.deleteHistoricoFuegosByZamif(this.selectedZamif).subscribe();

    this.historicoData.forEach(historico => {
      this.ejecucionService.saveOrUpdateHistoricoFuegos(historico).subscribe();
    })
    this.uiService.presentToast("Mensaje guardado");
  }

  onChange() {
    this.isChanged = true;
    this.dataChanged.emit(this.isChanged);
  }

}
