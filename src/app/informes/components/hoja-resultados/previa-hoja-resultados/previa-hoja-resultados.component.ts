import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { DatosEjecucionService } from 'src/app/ejecucion/services/datos-ejecucion.service';
import { eDocument, eTipo, SPresupuestos } from 'src/app/informes/modelData';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-previa-hoja-resultados',
  templateUrl: './previa-hoja-resultados.component.html',
  styleUrls: ['./previa-hoja-resultados.component.scss'],
})
export class PreviaHojaResultadosComponent implements OnInit, IDataContainer {
  @ViewChild('content')
  content: ElementRef;

  moneda: string;

  listaOpciones: SPresupuestos[] = [];

  colSpan: number;
  tipoResultado: string = '';
  acumuladosStr: string = '';
  promediosStr: string = '';
  fileName: string;

  constructor(private appService: AppService, private utilService: UtilService, private uiService: UiService, private translateService: TranslateService,
    private datosEjecucionService: DatosEjecucionService, private translate: TranslateService) { }

  @Input()
  data: any;

  buttons = {
    refComponent: this,
    buttons: []
  }


  ngOnInit() {
    this.moneda = this.utilService.getMoneda().moneda;

    this.translateService.get(["Acumulados", "Promedios"]).subscribe(res => {
      this.acumuladosStr = res['Acumulados'];
      this.promediosStr = res['Promedios'];

      this.prepareHtml(this.data.tipoResultado);
    })

    this.translate.get('Hoja de resultados').subscribe((res: string) => {
      this.fileName = res;
    });
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

  async prepareHtml(resultados: number) {
    this.tipoResultado = (resultados == eTipo.eAcumlados ? this.acumuladosStr : this.promediosStr);

    for (let gdcf = 0; gdcf < this.data.selectedGrupos.length; gdcf++) {
      let idGDCF = this.data.selectedGrupos[gdcf].idGdcf;
      let contadorMedios: number[] = []
      this.listaOpciones = [];
      for (let i = 0; i < this.data.selectedOpciones.length; i++) {
        let opcion = this.data.selectedOpciones[i];
        contadorMedios.push(0);
        
        let sPresupuestos = new SPresupuestos();
        sPresupuestos.idOpcion = opcion.idOpcion;
        sPresupuestos.opcion = opcion.opcion;
        sPresupuestos.descripcion = opcion.descripcion;
        // no puede ser null
        sPresupuestos.presupuesto = await this.datosEjecucionService.calcularPresupuesto(sPresupuestos.idOpcion);
        sPresupuestos.numSimulaciones = await this.datosEjecucionService.calcularNumSimulaciones(sPresupuestos.idOpcion, idGDCF);

        if (resultados === eTipo.eAcumlados && sPresupuestos.numSimulaciones !== 0) {
          sPresupuestos.presupuesto *= sPresupuestos.numSimulaciones;
        }
        this.listaOpciones.push(sPresupuestos);
      }

      this.listaOpciones.sort((item1: SPresupuestos, item2: SPresupuestos) => {
        return item1.presupuesto - item2.presupuesto;
      });

      // Detalle medios
      for (let index = 0; index < this.data.dataCategoriaMedios.length; index++) {
        const element = this.data.dataCategoriaMedios[index];
        let idCategoriaMedios = element.idCategoriaMedios;
        this.data.dataCategoriaMedios[index].codDesc = element.codDesc;
        this.data.dataCategoriaMedios[index].presupuesto = []
        this.data.dataCategoriaMedios[index].cantidad = []

        let total = 0;
        for (let i = 0; i < this.listaOpciones.length; i++) {
          let cantidad = await this.datosEjecucionService.getCountMediosWhereOpcionCategoria(this.listaOpciones[i].idOpcion, idCategoriaMedios);
          total += cantidad;
          let presupuesto = await this.datosEjecucionService.calcularPresupuesto(this.listaOpciones[i].idOpcion, idCategoriaMedios);
          if (resultados == eTipo.eAcumlados) {
            presupuesto *= this.listaOpciones[i].numSimulaciones;
          }
          this.data.dataCategoriaMedios[index].presupuesto.push(presupuesto);
          this.data.dataCategoriaMedios[index].cantidad.push(cantidad);
        }
      }

      // Resumenes finales

      for (let i = 0; i < this.listaOpciones.length; i++) {
        // presupuesto total ya calculado: this.listaOpciones[i].presupuesto
        this.listaOpciones[i].total = this.listaOpciones[i].presupuesto;
        // costo
        let costo = await this.datosEjecucionService.calcularResultados("CPH * Area + Costo", (resultados == eTipo.eAcumlados ? "SUM" : "AVG"), this.listaOpciones[i].idOpcion, idGDCF);
        //costo += this.helperService.CalcularResultados("Costo", tipoResultado, listaOpciones[i].idOpcion, idGDCF);
        costo = parseFloat(costo.toFixed(0))
        this.listaOpciones[i].costo = costo;
        this.listaOpciones[i].total += costo;

        // cambio neto valor recursos
        let cnvr = await this.datosEjecucionService.calcularResultados("CNVR", (resultados == eTipo.eAcumlados ? "SUM" : "AVG"), this.listaOpciones[i].idOpcion, idGDCF);
        cnvr = Number.parseFloat(cnvr.toFixed(0))
        this.listaOpciones[i].cnvr = cnvr;
        this.listaOpciones[i].total -= cnvr;

        // superficie
        let has = await this.datosEjecucionService.calcularResultados("Area", (resultados == eTipo.eAcumlados ? "SUM" : "AVG"), this.listaOpciones[i].idOpcion, idGDCF);
        this.listaOpciones[i].superficie = parseFloat(has.toFixed(2))

        // total ya calculado
        // this.listaOpciones[i].total

        // num simulaciones
        let numSim = this.listaOpciones[i].numSimulaciones;
        let numEsc = await this.datosEjecucionService.calcularNumEscapados(this.listaOpciones[i].idOpcion, idGDCF);

        // num escapados
        this.listaOpciones[i].numSimulaciones = numSim;
        this.listaOpciones[i].numEscapados = numEsc;
      }

      this.colSpan = this.listaOpciones.length + 1;
    }
  }


  get base64Logo() {
    return this.utilService.getBase64Logo();
  }

  save(){
    let content: any;
    let type = parseInt(this.data.tipoDocumento);
    if (type - 1 == eDocument.eEXCEL) {
       content = this.generarInformeExcel();
    } else {
      content = this.utilService.getHeaderHtml();
      content += this.content.nativeElement.innerHTML;
      content += "</body></html>"
    }
    this.generar(content);
  }

  generarInformeExcel() {
    let wb = this.utilService.create_book();
    for (let index = 0; index < this.data.selectedGrupos.length; index++) {
      let ws = this.utilService.init_sheet([], false);
      const gdcf = this.data.gruposComportamientoFuego[index];
      ws = this.utilService.exportTableToExcel(ws, "tableId" + index)
      let nameSheet = "(" +gdcf.gdcf + ") " + gdcf.descripcion;
      if(nameSheet.length > 30){
        nameSheet = nameSheet.substring(0,30);
      }
      this.utilService.append_worksheet_to_book(wb, ws, nameSheet);
    }
    return wb;
  }

  close(){
    this.appService.goPrev();
  }

  generar(content): boolean {
    const selectedDoc = Number.parseInt(this.data.tipoDocumento) - 1

    switch (selectedDoc) {
      case eDocument.eHTML:
        this.uiService.presentLoading("Exportando");
        content = new Blob([content], { type: "text/html;charset=utf-8" });
        this.utilService.saveFile(content, this.fileName + ".html");
        break;
      case eDocument.ePDF:
        var doc = new jsPDF('p', 'pt', 'a4');

        const options = {
          background: 'white',
          scale: 3,
          windowWidth: 1000
        };
        
        this.uiService.presentLoading("Exportando");
        // dividimos el contenido para tener grupo por página
        let contentGrupo = [];
        contentGrupo = content.split('separator');
        for (let index = 1; index < contentGrupo.length; index++) {
          let content = contentGrupo[index];
          this.utilService.generatePdf(contentGrupo[0] + content, doc, options)
              .then(() => {
                if (index === contentGrupo.length - 1) {
                  // añadir número de páginas
                  this.utilService.addNumPages(doc);
                  var node = doc.outline.add(null, this.fileName, null);

                  for (let index = 0; index < this.data.selectedGrupos.length; index++) {
                    const grupo = this.data.selectedGrupos[index];
                    // añadir marcadores
                    doc.outline.add(node, "Gdcf " + (index + 1) + ": (" + grupo.gdcf + ") " + grupo.descripcion, { pageNumber: index + 1 });
                  }
                  this.utilService.saveFile(doc.output('blob'), this.fileName + ".pdf");
                }
                else {
                  doc.addPage()
                }
              })
        }

        break;
      case eDocument.eEXCEL:
        this.uiService.presentLoading("Exportando");
        var wopts = { bookType:"xlsx", bookSST:false, type:"array" };
        var wbout = this.utilService.writeXLSX(content, wopts);
        content = new Blob([wbout], { type: "application/octet-stream" });
        this.utilService.saveFile(content, this.fileName + ".xlsx");
        break;
    }
    return true;
  }
}
