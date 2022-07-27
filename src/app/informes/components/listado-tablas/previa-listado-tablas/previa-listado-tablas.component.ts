import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { firstValueFrom } from 'rxjs';
import { SPresupuestos, DataEscapados, DataCnvr, DataTablaMaestra, DataGrupoCnvr, DataMedioLr, IntensidadesData, eDocument } from 'src/app/informes/modelData';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { RecursosService } from 'src/app/recursos-naturales/services/recursos.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';
import { sLR, sZAMIF } from 'src/app/shared/modelData';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { Cph } from 'src/entities/Cph';
import { Medios } from 'src/entities/Medios';
import { RecursosForestales } from 'src/entities/RecursosForestales';

@Component({
  selector: 'app-previa-listado-tablas',
  templateUrl: './previa-listado-tablas.component.html',
  styleUrls: ['./previa-listado-tablas.component.scss'],
})
export class PreviaListadoTablasComponent implements OnInit, IDataContainer {
  @ViewChild('content')
  content: ElementRef;

  moneda: string;

  listaOpciones: SPresupuestos[] = [];

  colSpan: number;
  tipoResultado: string = '';
  cphsData: Cph[][] = [];
  datosEscapados: DataEscapados[][] = [];
  datosCnvr: DataCnvr[][] = [];
  datosTablaMaestra: DataTablaMaestra[] = [];

  recursosForestales: RecursosForestales[] = [];
  costeTablaVisible: boolean = false;
  escapadosTablaVisible: boolean = false;
  tablaMaestraVisible: boolean = false;
  cnvrTablaVisible: boolean = false;

  @Input()
  data: any;
  fileName: string;

  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private appService: AppService,
    public utilService: UtilService,
    private recursosService: RecursosService,
    private zonasService: ZonasService,
    private mediosService: MediosService,
    private translate: TranslateService,
    private uiService: UiService) { }


  ngOnInit() {
    this.prepareHtml();
    this.moneda = this.utilService.getMoneda().moneda;
    this.colSpan = 10;

    // todos los recursos
    this.recursosService.getRecursosList().subscribe(recursos => {
      this.recursosForestales = recursos;
    })

    this.data.selectedTables.forEach(option => {
      switch (option.id) {
        case 1:
          this.costeTablaVisible = true;
          break;
        case 2:
          this.escapadosTablaVisible = true;
          break;
        case 3:
          this.tablaMaestraVisible = true;
          break;
        case 4:
          this.cnvrTablaVisible = true;
          break;

        default:
          break;
      }
    });

    this.translate.get('Listado de tablas').subscribe((res: string) => {
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

  async prepareHtml() {
    // coste de extinción promedio por hectarea
    for (let index = 0; index < this.data.selectedZamif.length; index++) {
      const zamif = this.data.selectedZamif[index];
      let sZamif = new sZAMIF();

      let costes = await firstValueFrom(this.zonasService.getCphsByZamif(zamif.idZamif));
      this.cphsData.push(costes);

      let dataCnvrZamif: DataCnvr[] = [];
      let idLrs = [];
      let lugares = [];
      let dataTablaMaestra: DataMedioLr[] = [];

      // Tabla de Incendios Escapados
      for (let index = 0; index < zamif.lrs.length; index++) {
        const lr = zamif.lrs[index];
        const sLr: sLR = new sLR();
        idLrs.push(lr.idLr);
        lugares.push(lr);
        sLr.IdLR = lr.idLr;
        sLr.LR = "(" + lr.lr + ") " + lr.descripcion;

        sZamif.LR.push(sLr);

        let items = await firstValueFrom(this.zonasService.getDcflrsByGfcdAndLr(this.data.selectedGrupos[0].idGdcf, lr.idLr));
        items.forEach(dcflr => {
          const intensidad = dcflr.intensidad;
          if (intensidad >= 1 && intensidad <= 6) {
            sZamif.LR[index].DCFLR.superficieEscXXpctl[0].push(dcflr.superficieEsc50pctl);
            sZamif.LR[index].DCFLR.superficieEscXXpctl[1].push(dcflr.superficieEsc90pctl);
          }
        });

        let dataEscapadoZamif: DataEscapados[] = [];
        dataEscapadoZamif.push({
          lugar: lr, percentil: 50,
          intensidad1: sZamif.LR[index].DCFLR.superficieEscXXpctl[0][0],
          intensidad2: sZamif.LR[index].DCFLR.superficieEscXXpctl[0][1],
          intensidad3: sZamif.LR[index].DCFLR.superficieEscXXpctl[0][2],
          intensidad4: sZamif.LR[index].DCFLR.superficieEscXXpctl[0][3],
          intensidad5: sZamif.LR[index].DCFLR.superficieEscXXpctl[0][4],
          intensidad6: sZamif.LR[index].DCFLR.superficieEscXXpctl[0][5],
        });
        dataEscapadoZamif.push({
          lugar: lr, percentil: 90,
          intensidad1: sZamif.LR[index].DCFLR.superficieEscXXpctl[1][0],
          intensidad2: sZamif.LR[index].DCFLR.superficieEscXXpctl[1][1],
          intensidad3: sZamif.LR[index].DCFLR.superficieEscXXpctl[1][2],
          intensidad4: sZamif.LR[index].DCFLR.superficieEscXXpctl[1][3],
          intensidad5: sZamif.LR[index].DCFLR.superficieEscXXpctl[1][4],
          intensidad6: sZamif.LR[index].DCFLR.superficieEscXXpctl[1][5],
        });
        this.datosEscapados.push(dataEscapadoZamif);
      }

      //Tabla maestra de recursos
      let medios = await firstValueFrom(this.mediosService.getMediosByLrs(idLrs));
      medios.forEach(async element => {
        let lrData = [];
        for (let indexLr = 0; indexLr < idLrs.length; indexLr++) {
          const idlr = idLrs[indexLr];

          let inventario = await firstValueFrom(this.mediosService.getInventarioMediosByMedio(idlr, element.idMedio));
          const rendimiento = inventario.rendimiento;
          const costoUnitarioPorMision = inventario.costoUnitarioPorMision;
          const tiempoLlegada = inventario.tiempoLlegada;
          lrData.push({ rendimiento: rendimiento, tiempoLlegada: tiempoLlegada, costoUnitarioPorMision: costoUnitarioPorMision });

        }
        dataTablaMaestra.push({ medio: element, medioData: lrData })
      })

      // [lugares: Lr[], data: DataTablaMaestra[]]
      this.datosTablaMaestra.push({ lugares: lugares, data: dataTablaMaestra });

      // Cambio Neto en el valor de los recursos
      // Procesamos los GrupoCNVR usados en los Lugares Representativos de esta ZAMIF

      let grupos = await firstValueFrom(this.recursosService.getGrupoCnvrByZamif(idLrs));
      let grupo = null;
      let dataGrupoCnvr: DataGrupoCnvr[] = [];
      grupos.forEach(async element => {
        let total = [0, 0, 0, 0, 0, 0];
        // como máximo un grupocnvr por LR
        if (grupos.length != 0) {
          grupo = element;
        }

        // varios lrs por grupo cnvr
        let lugares = await firstValueFrom(this.zonasService.getLugaresRepresentativosByCnvr(grupo.idGrupoCnvr));

        let intensidadesData: IntensidadesData[] = [];
        let intensidad = [0, 0, 0, 0, 0, 0]
        let cnvrList = await firstValueFrom(this.recursosService.getCnvrByGrupoCnvr(grupo.idGrupoCnvr));
        cnvrList.forEach(cnvr => {
          for (let i = 0; i < 6; ++i) {
            let valor = cnvr['intensidad' + (i + 1)]
            if (valor != 0 && valor != undefined) {
              intensidad[i] = -valor;
              total[i] += -valor;
            }
          }
          intensidadesData.push(new IntensidadesData(cnvr.idRecursoForestal.descripcion,
            intensidad[0], intensidad[1], intensidad[2], intensidad[3], intensidad[4], intensidad[5]));
        })
        dataGrupoCnvr.push({ lugares: lugares, grupo: grupo, intensidadesData: intensidadesData, total: total });
      });
      dataCnvrZamif.push({ grupos: dataGrupoCnvr })
      this.datosCnvr.push(dataCnvrZamif);
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
    for (let index = 0; index < this.data.selectedZamif.length; index++) {
      let ws = this.utilService.init_sheet([], false);
      const zamif = this.data.selectedZamif[index];
      ws = this.utilService.exportTableToExcel(ws, "tableId" + index)
      let nameSheet = "(" +zamif.zamif + ") " + zamif.descripcion;
      if(nameSheet.length > 30){
        nameSheet = nameSheet.substring(0,30);
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
        // dividimos el contenido para Zamif por página
        let contentZamif = [];
        contentZamif = content.split('separator');
        for (let index = 1; index < contentZamif.length; index++) {
          let content = contentZamif[index];
          content = contentZamif[0] + content;

          this.utilService.generatePdf(content, doc, options)
            .then(() => {
              if (index === contentZamif.length - 1) {
                // añadir número de páginas
                this.utilService.addNumPages(doc);
                var nodeParent = doc.outline.add(null, this.fileName, null);

                let numPage = 0;
                for (let index = 0; index < this.data.selectedZamif.length; index++) {
                  const zamif = this.data.selectedZamif[index];
                  // añadir marcadores
                  var node = doc.outline.add(nodeParent, "Zamif: (" + zamif.zamif + ") " + zamif.descripcion, { pageNumber: ++numPage });
           
                  // TO-DO: Arreglar cuando no se selecciona CNVR
                  this.datosCnvr[index][0].grupos.forEach(element => {
                    doc.outline.add(node,"Cnvr: (" + element.grupo.grupoCnvr + ") " + element.grupo.descripcion, { pageNumber: ++numPage });
                  });
                }

                this.utilService.saveFile(doc.output('blob'), this.fileName);
              }
              else {
                doc.addPage()
              }
            })
        }

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
