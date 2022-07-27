import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import {
  Chart,
  CategoryScale,
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  Decimation,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  SubTitle,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from 'chart.js'

import { SPresupuestos } from 'src/app/informes/modelData';
import { UtilService } from 'src/app/services/util.service';
import { TranslateService } from '@ngx-translate/core';
import { DatosEjecucion } from 'src/entities/DatosEjecucion';
import { DatosEjecucionService } from 'src/app/ejecucion/services/datos-ejecucion.service';

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);

const thisAsThat = (callBack: Function) => {
  const self = this;
  return function () {
    return callBack.apply(self, [this].concat(Array.prototype.slice.call(arguments)));
  };
}

@Component({
  selector: 'app-previa-grafico-costo',
  templateUrl: './previa-grafico-costo.component.html',
  styleUrls: ['./previa-grafico-costo.component.scss'],
})
export class PreviaGraficoCostoComponent implements OnInit, IDataContainer {
  @ViewChild('content')
  content: ElementRef;

  moneda: string;

  listaOpciones: SPresupuestos[] = [];

  colSpan: number;
  tipoResultado: string = '';

  //@ViewChild(ChartComponent) chart: ChartComponent;

  costoTitulo: string;
  supresionTitulo: string;
  valorRecursosTitulo: string;
  type: string;

  options: any;

  fullScreenState: boolean = false;
  gdcfTitle: string = '';
  canvas: any;
  ctx: any;
  dataChart: Chart<"bar", any[], any>;
  datosTitulo: string = '';
  fechaTitulo: any;
  tituloCnvr: any;

  buttons = {
    refComponent: this,
    buttons: []
  }


  @Input()
  data: any;

  constructor(private appService: AppService,
    private utilService: UtilService,
    private translate: TranslateService,
    private datosEjecucionService: DatosEjecucionService) { }


  ngOnInit() {
    this.moneda = this.utilService.getMoneda().moneda;

    this.translate.get(['Costo', 'Supresión', 'Valor recursos', 'Datos', 'Fecha', 'Costo - Cambio neto en el valor de los recursos']).subscribe((res: string) => {
      this.costoTitulo = res['Costo'];
      this.supresionTitulo = res['Supresión'];
      this.valorRecursosTitulo = res['Valor recursos'];
      this.datosTitulo = res['Datos'];
      this.fechaTitulo = res['Fecha'];
      this.tituloCnvr = res['Costo - Cambio neto en el valor de los recursos'];
    });

    this.initGraficoCosto();

    this.prepareHtml();

    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "close", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "save", icon: "done", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  get base64Logo() {
    return this.utilService.getBase64Logo();
  }

  initGraficoCosto() {
    this.canvas = document.getElementById('chartCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.dataChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: '', // Costo
            data: [],
            backgroundColor: "#FF5733"
          },
          {
            label: '', // Supresión
            data: [],
            backgroundColor: "#83D858"
          },
          {
            label: '', // Valor recursos
            data: [],
            backgroundColor: "#5898D8"
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: ""
          },
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: { size: 15 }
            }
          },
          tooltip: {
            callbacks: {
              label: thisAsThat((that: any, otherArgument: any) => {
                //console.log(this); // the class
                //console.log(that); // the chart object
                let content = that.dataPoints[0];
                let label = content.dataset.label || '';

                if (label) {
                  label += ': ';
                }
                if (content.parsed.y !== null) {
                  label += `${content.formattedValue} ${this.moneda}`;
                }

                return label;

              })
            }
          },
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: {
              callback: label => {
                label = label.toString();
                const divided = label.split(/(?=(?:...)*$)/);
                // Convert the array to a string and format the output
                label = divided.join('.')
                return `${label} ${this.moneda}`;
              }
            }
          }
        }
      }
    });

  }

  get today() {
    return new Date().toLocaleDateString();
  }


  async prepareHtml() {

    let idGdcf = this.data.selectedGrupos[0].idGdcf;
    let gdcf = "(" + this.data.selectedGrupos[0].gdcf + ") " + this.data.selectedGrupos[0].descripcion;

    //ChartC_VNR->Series[0]->Title = "Costo"; // presupuesto
    //ChartC_VNR->Series[1]->Title = "Supresión"; // costo
    //ChartC_VNR->Series[2]->Title = "Valor recursos"; // cnvr


    for (let index = 0; index < this.data.selectedOpciones.length; index++) {
      const opcion = this.data.selectedOpciones[index];

      const idOpcion = opcion.idOpcion;
      const opcionStr = "(" + opcion.opcion + ") " + opcion.descripcion;

      let presupuesto = await this.datosEjecucionService.calcularPresupuesto(idOpcion);
      presupuesto = parseFloat(presupuesto.toFixed(0))
      let costo = await this.datosEjecucionService.calcularResultados("CPH * Area + Costo", "AVG", idOpcion, idGdcf);
      costo = parseFloat(costo.toFixed(0))
      let cnvr = await this.datosEjecucionService.calcularResultados("CNVR", "AVG", idOpcion, idGdcf);
      cnvr = -parseFloat(cnvr.toFixed(0))

      this.dataChart.data.labels.push(opcionStr);

      this.dataChart.data.datasets[0].label = this.costoTitulo;
      this.dataChart.data.datasets[0].data.push(presupuesto);
      this.dataChart.data.datasets[1].label = this.supresionTitulo;
      this.dataChart.data.datasets[1].data.push(costo);
      this.dataChart.data.datasets[2].label = this.valorRecursosTitulo;
      this.dataChart.data.datasets[2].data.push(cnvr);


    }

    this.gdcfTitle = gdcf;
    this.dataChart.update();
  }

  save() {

  }

  close() {
    this.appService.goPrev();
  }

}
