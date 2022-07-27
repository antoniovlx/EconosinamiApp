import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { DatosEjecucionService } from 'src/app/ejecucion/services/datos-ejecucion.service';
import { eDocument, eOrden, eTipo, SPresupuestos } from 'src/app/informes/modelData';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { Any } from 'typeorm';

@Component({
  selector: 'app-previa-sumario-opciones',
  templateUrl: './previa-sumario-opciones.component.html',
  styleUrls: ['./previa-sumario-opciones.component.scss'],
})
export class PreviaSumarioOpcionesComponent implements OnInit, IDataContainer {
  @ViewChild('content')
  content: ElementRef;

  moneda: string;

  listaOpciones: SPresupuestos[] = [];

  colSpan: number;
  tipoResultado: string = '';
  acumuladosStr: string = '';
  promediosStr: string = '';

  @Input()
  data: any;
  fileName: string;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private appService: AppService,
    private translateService: TranslateService,
    public utilService: UtilService,
    private datosEjecucionService: DatosEjecucionService,
    private uiService: UiService, private translate: TranslateService) { }


  ngOnInit() {
    this.colSpan = 6;
    this.moneda = this.utilService.getMoneda().moneda;

    this.translateService.get(["Acumulados", "Promedios"]).subscribe(res => {
      this.acumuladosStr = res['Acumulados'];
      this.promediosStr = res['Promedios'];
      this.prepareHtml(this.data.tipoResultado);
    })

    this.translate.get('Sumario de opciones').subscribe((res: string) => {
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
    const ordenar = this.data.ordenarPor;

    for (let gdcf = 0; gdcf < this.data.selectedGrupos.length; gdcf++) {
      let idGDCF = this.data.selectedGrupos[gdcf].idGdcf;
      this.listaOpciones = [];
      for (let i = 0; i < this.data.selectedOpciones.length; i++) {

        let sPresupuestos = new SPresupuestos();
        sPresupuestos.idOpcion = this.data.selectedOpciones[i].idOpcion;
        sPresupuestos.opcion = "(" + this.data.selectedOpciones[i].opcion + ") " + this.data.selectedOpciones[i].descripcion;
        sPresupuestos.presupuesto = await this.datosEjecucionService.calcularPresupuesto(sPresupuestos.idOpcion);
        sPresupuestos.numSimulaciones = await this.datosEjecucionService.calcularNumSimulaciones(sPresupuestos.idOpcion, idGDCF);

        if (this.tipoResultado && sPresupuestos.numSimulaciones) {
          sPresupuestos.presupuesto *= sPresupuestos.numSimulaciones;
        }
        
        let costo = await this.datosEjecucionService.calcularResultados("CPH * Area", (resultados == eTipo.eAcumlados ? "SUM" : "AVG"), sPresupuestos.idOpcion, idGDCF);
        costo += await this.datosEjecucionService.calcularResultados("Costo", (resultados == eTipo.eAcumlados ? "SUM" : "AVG"), sPresupuestos.idOpcion, idGDCF);
        sPresupuestos.costo = Number.parseFloat(costo.toFixed(2));

        let cnvr = await this.datosEjecucionService.calcularResultados("CNVR", (resultados == eTipo.eAcumlados ? "SUM" : "AVG"), sPresupuestos.idOpcion, idGDCF);
        sPresupuestos.cnvr = Number.parseFloat(cnvr.toFixed(2));
        let area = await this.datosEjecucionService.calcularResultados("Area", (resultados == eTipo.eAcumlados ? "SUM" : "AVG"), sPresupuestos.idOpcion, idGDCF);
        sPresupuestos.superficie = Number.parseFloat(area.toFixed(2));
        let total = sPresupuestos.presupuesto + costo - cnvr;
        sPresupuestos.total = Number.parseFloat(total.toFixed(2));

        this.listaOpciones.push(sPresupuestos);

      }


      switch (ordenar) {
        case eOrden.eOpcion:
          this.listaOpciones.sort((a, b) => a.opcion > b.opcion ? 1 : -1)
          break;
        case eOrden.ePresupuesto:
          this.listaOpciones.sort((a, b) => a.presupuesto - b.presupuesto)
          break;
        case eOrden.eTotal:
          this.listaOpciones.sort((a, b) => a.total - b.total)
          break;
        case eOrden.eSuperficie:
          this.listaOpciones.sort((a, b) => a.superficie - b.superficie)
          break;
      }
    }


  }

  close() {
    this.appService.goPrev();
  }

  save() {
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
      const grupo = this.data.selectedGrupos[index];
      ws = this.utilService.exportTableToExcel(ws, "tableId" + index)
      let nameSheet = "(" + grupo.gdcf + ") " + grupo.descripcion;
      if (nameSheet.length > 30) {
        nameSheet = nameSheet.substring(0, 30);
      }
      this.utilService.append_worksheet_to_book(wb, ws, nameSheet);
    }
    return wb;
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
        this.utilService.generatePdf(content, doc, options)
          .then(() => {
            this.utilService.addNumPages(doc);
            this.utilService.saveFile(doc.output('blob'), this.fileName + ".pdf");
          })
        break;
      case eDocument.eEXCEL:
        this.uiService.presentLoading("Exportando");
        var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
        var wbout = this.utilService.writeXLSX(content, wopts);
        content = new Blob([wbout], { type: "application/octet-stream" });
        this.utilService.saveFile(content, this.fileName + ".xlsx");
        break;
    }
    return true;
  }

  get base64Logo() {
    return this.utilService.getBase64Logo();
  }

}
