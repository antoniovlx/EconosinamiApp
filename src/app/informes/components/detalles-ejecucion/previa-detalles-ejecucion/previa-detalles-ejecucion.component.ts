import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { SPresupuestos, DataIntensidad, DataEstimacionHectareas, OpcionData, DataNivelTamanoFuego, DataIntensidadHectareas, DataResumenFuegosLr, DataIntensidadesActivacion, DataIntensidadesActivacionLr, eDocument } from 'src/app/informes/modelData';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { GruposDcf } from 'src/entities/GruposDcf';
import { ModelosCombustible } from 'src/entities/ModelosCombustible';

@Component({
  selector: 'app-previa-detalles-ejecucion',
  templateUrl: './previa-detalles-ejecucion.component.html',
  styleUrls: ['./previa-detalles-ejecucion.component.scss'],
})
export class PreviaDetallesEjecucionComponent implements OnInit, IDataContainer {
  @ViewChild('content')
  content: ElementRef;

  moneda: string;

  listaOpciones: SPresupuestos[] = [];

  colSpan: number;
  tipoResultado: string = '';
  modelos: ModelosCombustible[] = [];
  selectedGrupo: GruposDcf;
  nivelesIntensidadTablaVisible: boolean;
  hectareasQuemadasTablaVisible: boolean;
  fuegosAnualesTablaVisible: boolean;
  fuegosAnualesLugaresTablaVisible: boolean;
  intensidadActivacionMediosTablaVisible: boolean;

  datosIntensidad: DataIntensidad[] = [];
  datosHectareas: DataEstimacionHectareas

  @Input()
  data: any;

  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private appService: AppService,
    private zonasService: ZonasService,
    private ejecucionService: EjecucionService,
    private utilService: UtilService) { }


  ngOnInit() {
    this.prepareHtml(this.data.tipoResultado);
    this.moneda = this.utilService.getMoneda().moneda;
    this.colSpan = 14;
    this.selectedGrupo = this.data.selectedGrupos[0];

    this.zonasService.getModelosCombustibles().subscribe(modelos => {
      this.modelos = modelos;
    })

    this.data.selectedTables.forEach(option => {
      switch (option.id) {
        case 1:
          this.nivelesIntensidadTablaVisible = true;
          break;
        case 2:
          this.hectareasQuemadasTablaVisible = true;
          break;
        case 3:
          this.fuegosAnualesTablaVisible = true;
          break;
        case 4:
          this.fuegosAnualesLugaresTablaVisible = true;
          break;
        case 5:
          this.intensidadActivacionMediosTablaVisible = true;
          break;

        default:
          break;
      }
    })
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Cancelar", action: "close", icon: "cancel", class: "red-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "save", icon: "done", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }

  get today() {
    return new Date().toLocaleDateString();
  }

  getModeloCombustible(idModelo: number) {
    let modelo = this.modelos.find(modelo => modelo.idModeloCombustible == idModelo);
    if (modelo !== undefined) {
      return modelo.idModeloCombustible + ".- " + modelo.modeloCombustible;
    } else {
      return "";
    }
  }

  async prepareHtml(resultados: number) {

    for (let index = 0; index < this.data.selectedZamif.length; index++) {
      let dataZamif: DataIntensidad = new DataIntensidad();
      const zamif = this.data.selectedZamif[index];
      dataZamif.zamif = zamif;
      dataZamif.grupo = this.data.selectedGrupos[0];

      for (let indexOpcion = 0; indexOpcion < this.data.selectedOpciones.length; indexOpcion++) {
        const opcion = this.data.selectedOpciones[indexOpcion];
        let dataOpcion = new OpcionData();
        dataOpcion.opcion = opcion;

        // detalles ejecuciones
        let ejecuciones = await firstValueFrom(this.ejecucionService.getEjecucionesByParameters(zamif.idZamif, this.data.selectedGrupos[0].idGdcf, opcion.idOpcion))
        const idEjecucion = ejecuciones[0].idEjecucion;

        let numFuegos = [];
        let velocidades: number[][] = [[], [], [], [], [], []];
        // Resumen según Niveles de Intensidad y Tamaño Final del Fuego
        let dcfList = await firstValueFrom(this.zonasService.getDcfByGfcdAndZamif(this.data.selectedGrupos[0].idGdcf, zamif.idZamif));
        dcfList.forEach(dcf => {
          const intensidad = dcf.intensidad;
          if (intensidad >= 0 && intensidad < 6) {
            numFuegos[intensidad - 1] = dcf.numFuegos;
            velocidades[intensidad - 1].push(dcf.velPropMax50pctl);
            velocidades[intensidad - 1].push(dcf.velPropMax90pctl);
          }
        })


        let ejecucionList = await firstValueFrom(this.ejecucionService.getEjecucionById(idEjecucion));
        ejecucionList.forEach(ejecucion => {
          let dataNivelTamanoFuego: DataNivelTamanoFuego = new DataNivelTamanoFuego();
          dataNivelTamanoFuego.lr = ejecucion.idLr.lr;
          dataNivelTamanoFuego.area = parseFloat(ejecucion.area.toFixed(2));
          dataNivelTamanoFuego.cnvr = ejecucion.cnvr;
          dataNivelTamanoFuego.frecuencia = parseFloat(ejecucion.frecuencia.toFixed(2));
          dataNivelTamanoFuego.intensidad = ejecucion.intensidad;
          dataNivelTamanoFuego.perimetro = parseFloat(ejecucion.perimetro.toFixed(2));
          dataNivelTamanoFuego.percentil = ejecucion.percentil;
          dataNivelTamanoFuego.numeroFuegos = numFuegos[dataNivelTamanoFuego.intensidad - 1];
          dataNivelTamanoFuego.costo = parseFloat((ejecucion.costo + ejecucion.cph).toFixed(2));
          dataNivelTamanoFuego.status = ejecucion.status;
          dataNivelTamanoFuego.velocidad = velocidades[dataNivelTamanoFuego.intensidad - 1][(dataNivelTamanoFuego.percentil == 50 ? 0 : 1)];
          dataOpcion.dataNivelTamanoFuego.push(dataNivelTamanoFuego);
        })

        let dataEstimacionHectareas: DataEstimacionHectareas = new DataEstimacionHectareas();
        let dataEstimacionFuegos: DataEstimacionHectareas = new DataEstimacionHectareas();

        // Estimación de las Hectáreas Quemadas Anualmente según Niveles de Intensidad y Tamaño Final del Fuego
        let historicoList = await firstValueFrom(this.ejecucionService.getHistoricoFuegos(zamif.idZamif));
        let historico = [0, 0, 0, 0, 0, 0, 0]; // 6 tamaños + total
        let historicoFuegos = [0, 0, 0, 0, 0, 0, 0]; // 6 tamaños + total

        historicoList.forEach(row => {
          const tamano = row.tamano;

          historico[tamano - 1] = row.area;
          historico[6] += row.area;

          historicoFuegos[tamano - 1] = row.numFuegos;
          historicoFuegos[6] += row.numFuegos;
        })
        dataEstimacionHectareas.historico = historico;
        dataEstimacionFuegos.historico = historicoFuegos;


        const currentSize = ["Area < 0.1", "(Area >= 0.1 and Area < 4)", "(Area >= 4 and Area < 40)",
          "(Area >= 40 and Area < 120)", "(Area >= 120 and Area < 400)", "Area >= 400"]


        for (let intensidad = 0; intensidad < 6; intensidad++) {
          let dataIntensidadHectareas = new DataIntensidadHectareas();
          dataIntensidadHectareas.intensidad = intensidad + 1;
          let indexTamano = 0;
          currentSize.forEach(async size => {
            let result = await firstValueFrom(this.ejecucionService.getEjecucionWhereParemeters(idEjecucion, intensidad, "Area*Frecuencia", size));
            if (result[0].ASum !== null) {
              let asum: number = result[0].ASum;
              dataIntensidadHectareas.tamanos[indexTamano] = parseFloat(asum.toFixed(2));
              dataEstimacionHectareas.totalSize[indexTamano] += asum;
              dataIntensidadHectareas.totalIntensidad += asum;
            } else {
              dataIntensidadHectareas.tamanos[indexTamano] = 0;
            }
            indexTamano++;
          });
          dataEstimacionHectareas.totalSize[indexTamano] += dataIntensidadHectareas.totalIntensidad;
          dataEstimacionHectareas.dataIntensidad.push(dataIntensidadHectareas);
        }


        //let porcAcum = 0;
        for (let indexSize = 0; indexSize <= 6; indexSize++) {
          const difcArea = dataEstimacionHectareas.totalSize[indexSize] - dataEstimacionHectareas.historico[indexSize];

          /*if(indexSize < 6){
            porcAcum += dataEstimacionHectareas.totalSize[indexSize] / dataEstimacionHectareas.totalSize[6] * 100.0;
            dataEstimacionHectareas.porcentajeAcum[indexSize] = parseFloat(porcAcum.toFixed(2));;
          }*/

          if (dataEstimacionHectareas.historico[indexSize] != 0) {
            const porc = difcArea / dataEstimacionHectareas.historico[indexSize] * 100.0;
            dataEstimacionHectareas.porcentaje[indexSize] = parseFloat(porc.toFixed(2));
          }
        }

        dataOpcion.dataEstimacionHectareas = dataEstimacionHectareas;


        // Estimación del Número de Fuegos Anuales según Niveles de Intensidad y Tamaño Final del Fuego
        for (let intensidad = 0; intensidad < 6; intensidad++) {
          let dataIntensidadHectareas = new DataIntensidadHectareas();
          dataIntensidadHectareas.intensidad = intensidad + 1;
          let indexTamano = 0;
          currentSize.forEach(async size => {
            let result = await firstValueFrom(this.ejecucionService.getEjecucionWhereParemeters(idEjecucion, intensidad, "Frecuencia", size));
            if (result[0].ASum !== null) {
              let asum: number = result[0].ASum;
              dataIntensidadHectareas.tamanos[indexTamano] = parseFloat(asum.toFixed(2));
              dataEstimacionFuegos.totalSize[indexTamano] += asum;
              dataIntensidadHectareas.totalIntensidad += asum;
            } else {
              dataIntensidadHectareas.tamanos[indexTamano] = 0;
            }
            indexTamano++;
          });
          dataEstimacionFuegos.totalSize[indexTamano] += dataIntensidadHectareas.totalIntensidad;
          dataEstimacionFuegos.dataIntensidad.push(dataIntensidadHectareas);
        }


        let porcAcum = 0;
        for (let indexSize = 0; indexSize <= 6; indexSize++) {
          const difcArea = dataEstimacionFuegos.totalSize[indexSize] - dataEstimacionFuegos.historico[indexSize];

          if (indexSize < 6) {
            porcAcum += dataEstimacionFuegos.totalSize[indexSize] / dataEstimacionFuegos.totalSize[6] * 100.0;
            dataEstimacionFuegos.porcentajeAcum[indexSize] = parseFloat(porcAcum.toFixed(2));;
          }

          if (dataEstimacionFuegos.historico[indexSize] != 0) {
            const porc = difcArea / dataEstimacionFuegos.historico[indexSize] * 100.0;
            dataEstimacionFuegos.porcentaje[indexSize] = parseFloat(porc.toFixed(2));
          }
        }

        dataOpcion.dataEstimacionFuegosAnuales = dataEstimacionFuegos;



        let totalFrecuencia = 0, totalArea = 0, totalCosto = 0, totalCNVR = 0;

        let listaLr = [];
        zamif.lrs.forEach(async lr => {
          listaLr.push(lr.idLr);
          // Resumen de Fuegos Anuales y Cambio en el Valor Neto, por Lugares Representativos
          let result = await firstValueFrom(this.ejecucionService.getResumenFuegosEjecucion(idEjecucion, lr.idLr));
          if (result[0].SFreq !== null && result[0].SHas !== null && result[0].Supp !== null && result[0].SNVC !== null) {
            let dataResumenFuegosAnuales = new DataResumenFuegosLr();
            const frecuencia = result[0].SFreq;
            const area = result[0].SHas;
            const costo = result[0].Supp;
            const cnvr = result[0].SNVC;

            dataResumenFuegosAnuales.lr = lr;
            dataResumenFuegosAnuales.frecuencia = frecuencia;
            dataResumenFuegosAnuales.area = area;
            dataResumenFuegosAnuales.costo = costo;
            dataResumenFuegosAnuales.cnvr = cnvr;
            dataResumenFuegosAnuales.total = costo - cnvr;

            dataOpcion.dataResumenFuegosAnuales.data.push(dataResumenFuegosAnuales);

            totalFrecuencia += frecuencia;
            totalArea += area;
            totalCosto += costo;
            totalCNVR += cnvr;
          }


          // Intensidades de Activación de Medios por Lugares Representativos
          let intensidadActivacionList = await firstValueFrom(this.ejecucionService.getIntensidadActivacionByOpcionAndLr(opcion.idOpcion, lr.idLr));
          intensidadActivacionList.forEach(element => {
            let dataIntensidadesActivacion = new DataIntensidadesActivacion();

            const indexElement = dataOpcion.dataIntensidadesActivacionLr.findIndex(intensidad => intensidad.medio.idMedio === element.idMedio.idMedio)

            if (indexElement !== -1) {
              // existe, actualizar
              dataOpcion.dataIntensidadesActivacionLr[indexElement].data.push(new DataIntensidadesActivacionLr(element.idLr, element.intensidad));

            } else {
              dataIntensidadesActivacion.medio = element.idMedio;
              dataIntensidadesActivacion.data.push(new DataIntensidadesActivacionLr(element.idLr, element.intensidad));
              dataOpcion.dataIntensidadesActivacionLr.push(dataIntensidadesActivacion);
            }

          })
        })

        dataOpcion.dataResumenFuegosAnuales.total = [totalFrecuencia, totalArea, totalCosto, totalCNVR, totalCosto - totalCNVR];
        dataZamif.opciones.push(dataOpcion);
      }
      this.datosIntensidad.push(dataZamif);
    }
  }

  close() {
    this.appService.goPrev();
  }

  save() {

  }

  get base64Logo() {
    return this.utilService.getBase64Logo();
  }

}
