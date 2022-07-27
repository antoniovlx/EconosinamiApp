import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { Cnvr } from 'src/entities/Cnvr';
import { Especie } from 'src/entities/Especies';
import { GrupoCnvr } from 'src/entities/GrupoCnvr';
import { GrupoFustal } from 'src/entities/GrupoFustal';
import { GrupoLatizal } from 'src/entities/GrupoLatizal';
import { GrupoMontebravo } from 'src/entities/GrupoMontebravo';
import { IntensidadLatizal } from 'src/entities/IntensidadLatizal';
import { IntensidadMontebravo } from 'src/entities/IntensidadMontebravo';

@Component({
  selector: 'app-cambio-neto-valor-data',
  templateUrl: './cambio-neto-valor-data.component.html',
  styleUrls: ['./cambio-neto-valor-data.component.scss'],
})
export class CambioNetoValorDataComponent implements OnInit, IDataContainer {
  @Input()
  data: any;

  displayedColumns: string[] = ['bloqueado', 'recurso', 'intensidad1', 'intensidad2', 'intensidad3', 'intensidad4', 'intensidad5', 'intensidad6',];

  selectedGrupoCnvr: number;

  gruposCnvr: GrupoCnvr[];
  dataList: Cnvr[];

  dataToSave: { idGrupoCnvr: number, data: Cnvr[] }[] = [];

  unSaved: boolean;

  buttons = {
    refComponent: this,
    buttons: []
  }


  constructor(private appService: AppService, private zonasService: ZonasService,
    private ejecucionService: EjecucionService, private uiService: UiService) {

  }

  ngOnInit() {
    this.gruposCnvr = this.data.gruposCnvr;
    this.selectedGrupoCnvr = this.gruposCnvr[0].idGrupoCnvr;
    this.refreshData();
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Calcular", action: "calcularNVC", icon: "build", class: "blue-icon", disabled: false });
    this.buttons.buttons.push({ label: "Guardar", action: "confirm", icon: "done", class: "green-icon", disabled: false });
    this.appService.setActionButtonsChanged$(this.buttons);
  }


  refreshData() {
    const cnvrList = this.dataToSave.find(data => data.idGrupoCnvr == this.selectedGrupoCnvr);

    if (cnvrList === undefined) {
      this.ejecucionService.getCnvrByGrupoCnvr(this.selectedGrupoCnvr).subscribe(values => {
        this.dataList = values;
      });
    } else {
      this.dataList = cnvrList.data;
    }
  }

  close() {
    this.appService.goPrev();
  }

  confirm() {
    this.unSaved = false;

    let cnvrList: Cnvr[] = [];
    this.dataToSave.forEach(element => {
      cnvrList.push(...element.data);
    });

    cnvrList.forEach(cnvr => {
      this.ejecucionService.saveOrUpdateCnvr(cnvr).subscribe()
    })

    this.uiService.presentToast("Mensaje guardado");
    //this.appService.goPrev();
  }

  updateGrupoCnvr(idGrupoCnvr: number) {
    this.selectedGrupoCnvr = idGrupoCnvr;
    this.refreshData();
  }

  calcularNVC() {
    // obtener grupo cnvr a partir del id
    let index = this.gruposCnvr.findIndex(grupo => grupo.idGrupoCnvr == this.selectedGrupoCnvr)

    if (index == -1) {
      return false;
    }

    let grupoCnvr = this.gruposCnvr[index];
    const haTotal = grupoCnvr.haTotal;
    const idGrupoFustal = grupoCnvr.idGrupoFustal;
    const idGrupoLatizal = grupoCnvr.idGrupoLatizal;
    const idGrupoMontebravo = grupoCnvr.idGrupoMontebravo;

    if (haTotal == 0) {
      return false;
    }

    this.zonasService.getLugaresRepresentativosByCnvr(grupoCnvr.idGrupoCnvr).subscribe(async lr => {
      const costeRepoblacion = lr[0].costeRepoblacion;
      const valorSuelo = lr[0].valorSuelo;

      /*this.appservice.getCnvrByGrupoCnvr(grupoCnvr.idGrupoCnvr, false).subscribe(cnvrs => {*/
      for (let index1 = 0; index1 < this.dataList.length; index1++) {
        let valor: number[] = [];
        const cnvr = this.dataList[index1];

        if (cnvr.idRecursoForestal.descripcion === "Madera fustal")
          cnvr.idRecursoForestal.tipo = "F";
        else if (cnvr.idRecursoForestal.descripcion === "Madera latizal")
          cnvr.idRecursoForestal.tipo = "L";
        else if (cnvr.idRecursoForestal.descripcion === "Madera montebravo")
          cnvr.idRecursoForestal.tipo = "M";

        if (cnvr.idRecursoForestal.tipo == null || cnvr.idRecursoForestal.tipo == "") {
          const valor1 = cnvr.antesFuego * cnvr.idRecursoForestal.periodoPosterior;
          const valor2 = cnvr.valor * cnvr.idRecursoForestal.decFactor;

          valor.push((cnvr.intensidad1 - valor1) * valor2)
          valor.push((cnvr.intensidad2 - valor1) * valor2)
          valor.push((cnvr.intensidad3 - valor1) * valor2)
          valor.push((cnvr.intensidad4 - valor1) * valor2)
          valor.push((cnvr.intensidad5 - valor1) * valor2)
          valor.push((cnvr.intensidad6 - valor1) * valor2)
        } else if (cnvr.idRecursoForestal.tipo == "F") {
          for (let i = 0; i < 6; i++) {
            valor.push(idGrupoFustal ? -(await this.CalcularNVCMature(idGrupoFustal, i + 1)) : 0);
          }
        }
        else if (cnvr.idRecursoForestal.tipo == "L") {
          for (let i = 0; i < 6; i++) {
            valor.push(idGrupoLatizal ? -(await this.CalcularNVCImmature(idGrupoLatizal, "Latizal", i + 1, costeRepoblacion, valorSuelo)) : 0);
          }
        } else if (cnvr.idRecursoForestal.tipo == "M") {
          for (let i = 0; i < 6; i++) {
            valor[i] = (idGrupoMontebravo ? -(await this.CalcularNVCImmature(idGrupoMontebravo, "Montebravo", i + 1, costeRepoblacion, valorSuelo)) : 0);
          }
        }

        const factorEscala = cnvr.hectareas / haTotal;
        for (let i = 0; i < 6; i++) {
          valor[i] *= factorEscala;
        }
        cnvr.calcIntensidad1 = parseFloat(valor[0].toFixed(2));
        cnvr.calcIntensidad2 = parseFloat(valor[1].toFixed(2));
        cnvr.calcIntensidad3 = parseFloat(valor[2].toFixed(2));
        cnvr.calcIntensidad4 = parseFloat(valor[3].toFixed(2));
        cnvr.calcIntensidad5 = parseFloat(valor[4].toFixed(2));
        cnvr.calcIntensidad6 = parseFloat(valor[5].toFixed(2));

        //update 
        this.dataList[index1] = cnvr;
      }

      this.updateDataToSave();
    });
    /*})*/

  }
  updateDataToSave() {
    let index = this.dataToSave.findIndex(cnvr => cnvr.idGrupoCnvr == this.selectedGrupoCnvr);

    if (index != -1) {
      // actualizar
      this.dataToSave[index].data = this.dataList;
    } else {
      // nuevo
      this.dataToSave.push({ idGrupoCnvr: this.selectedGrupoCnvr, data: this.dataList })
    }
  }

  async CalcularNVCMature(idGrupoFustal: GrupoFustal, intensidad: number): Promise<number> {
    // "select GE.*, I.Mortalidad, I.PorcNoExtraido from Fustal GE, IntensidadFustal I where I.IdFustal = GE.IdFustal and I.Intensidad = " + String(intensidad);

    let total = 0;
    let intensidades = await firstValueFrom(this.ejecucionService.getIntensidadFustalByValor(intensidad));
    for (let index = 0; index < intensidades.length; index++) {
      const intensidad = intensidades[index];

      const porcTotal = intensidad.idFustal.porcTotal;
      const volumenHectarea = intensidad.idFustal.volumenHectarea;
      const valorMetro3 = intensidad.idFustal.valorMetro3;
      const diferenciaValor = intensidad.idFustal.diferenciaValor;
      const mortalidad = intensidad.mortalidad;
      const porcNoExtraido = intensidad.porcNoExtraido;
      const edadMasa = intensidad.idFustal.edadMasa;
      const edadCorte = intensidad.idFustal.edadFinal;

      const precioMadera = (valorMetro3 > 0 ? valorMetro3 : this.precioMedioEspecie(intensidad.idFustal.idEspecie, "Fustal"));

      let metodoAmericano = volumenHectarea * precioMadera;
      metodoAmericano += diferenciaValor * volumenHectarea * (100.0 - porcNoExtraido) / 100.0;

      // Nuevo
      let e;
      if (edadCorte >= 12 && edadCorte < 35) {
        e = Math.pow(1.06, edadCorte - edadMasa);
      } else if (edadCorte >= 35 && edadCorte < 65) {
        e = Math.pow(1.04, edadCorte - edadMasa);
      } else if (edadCorte >= 65 && edadCorte < 95) {
        e = Math.pow(1.025, edadCorte - edadMasa);
      } else if (edadCorte >= 95 && edadCorte <= 120) {
        e = Math.pow(1.015, edadCorte - edadMasa);
      }

      let metodoMediterraneo = precioMadera * volumenHectarea - (precioMadera - diferenciaValor) * volumenHectarea * (100.0 - porcNoExtraido) / 100.0;
      metodoMediterraneo += precioMadera * volumenHectarea * (e - 1) / e;

      if (metodoMediterraneo != 0 && metodoAmericano != 0) {
        const loss = 1.7 * metodoMediterraneo * metodoAmericano / (metodoMediterraneo + 0.85 * metodoAmericano);
        total += loss * porcTotal / 100.0 * mortalidad / 100.0;
      }
    }
    return total;
  }

  getIntensidadLatizalByValor(intensidad): Observable<IntensidadLatizal[]> {
    return this.ejecucionService.getIntensidadLatizalByValor(intensidad);
  }

  getIntensidadMontebravoByValor(intensidad): Observable<IntensidadMontebravo[]> {
    return this.ejecucionService.getIntensidadMontebravoByValor(intensidad);
  }

  CalcularNVCImmature(idGrupo: GrupoLatizal | GrupoMontebravo, tipo: string, intensidad: number, costeRepoblacion: number, valorSuelo: number) {
    this["getIntensidad" + tipo + "ByValor"](intensidad).subscribe(intensidades => {
      let total = 0
      for (let index = 0; index < intensidades.length; index++) {
        const intensidad = intensidades[index];

        const porcTotal = intensidad["idIntensidad" + tipo].porcTotal;
        let valorMetro3 = intensidad["idIntensidad" + tipo].valorMetro3;
        const incrementoAnual = intensidad["idIntensidad" + tipo].incrementoAnual / 100.0;
        const edadMasa = intensidad["idIntensidad" + tipo].edadMasa;
        /*
            double volumenCortado[4];
            long edadCorte[4];
        
            for (int i = 0; i < 3; i++) {
              volumenCortado[i] = AsDouble(ds, "VolumenCortado" + String(i+1));
              edadCorte[i] = AsDouble(ds, "EdadCorte" + String(i+1));
            }
        
            volumenCortado[3] = AsDouble(ds, "VolumenFinal");
            edadCorte[3] = AsDouble(ds, "EdadFinal");
        */
        const volumenCortado = intensidad["idIntensidad" + tipo].VolumenFinal;
        const edadCorte = intensidad["idIntensidad" + tipo].edadFinal;
        const entre25y75 = intensidad.entre25y75;
        const mas75 = intensidad.mas75;

        if (valorMetro3 <= 0)
          valorMetro3 = this.precioMedioEspecie(intensidad["idIntensidad" + tipo].idEspecie, tipo);
        /*
            double metodoAmericano = 0;
            for (int i = 0; i < 4; i++)
              metodoAmericano += volumenCortado[i] * valorMetro3 * pow((1 + incrementoAnual) / 1.04, edadCorte[i] - edadMasa);
        */
        let metodoAmericano = volumenCortado * valorMetro3 * Math.pow((1 + incrementoAnual) / 1.04, edadCorte - edadMasa);
        metodoAmericano *= 1 - Math.pow((1 + Math.min(incrementoAnual, 0.04)) / 1.04, edadMasa);

        // Nuevo
        let metodoMediterraneo;
        if (edadCorte >= 12 && edadCorte < 35) {
          const e = Math.pow(1.06, edadMasa);
          metodoMediterraneo = costeRepoblacion * (e + 1.27 * (e - 1)) + valorSuelo * (e - 1);
        } else if (edadCorte >= 35 && edadCorte < 65) {
          const e = Math.pow(1.04, edadMasa);
          metodoMediterraneo = costeRepoblacion * (e + 1.1 * (e - 1)) + valorSuelo * (e - 1);
        } else if (edadCorte >= 65 && edadCorte < 95) {
          const e = Math.pow(1.025, edadMasa);
          metodoMediterraneo = costeRepoblacion * (e + 1.1 * (e - 1)) + valorSuelo * (e - 1);
        } else if (edadCorte >= 95 && edadCorte <= 120) {
          const e = Math.pow(1.015, edadMasa);
          metodoMediterraneo = costeRepoblacion * (e + 1.43 * (e - 1)) + valorSuelo * (e - 1);
        }

        const loss = 1.7 * metodoMediterraneo * metodoAmericano / (metodoMediterraneo + 0.85 * metodoAmericano);
        total += loss * (mas75 + entre25y75 / 2.0) / 100.0 * porcTotal / 100.0;
      }
      return total;
    })
  }

  updateBloqueado(i: number) {
    if (this.dataList[i].bloqueado === 'True') {
      this.dataList[i].bloqueado = 'False';
    } else {
      this.dataList[i].bloqueado = 'True';
    }
  }

  precioMedioEspecie(especie: Especie, tipo: string): number {
    let valorMedio = 0;

    /*const fieldNameVol1 = "volumen1A" + tipo;
    const fieldNamePrec1 = "precio1A" + tipo;
    const fieldNameVol2 = "volumen2A" + tipo;
    const fieldNamePrec2 = "precio2A" + tipo;
    const fieldNameVol3 = "volumen3A" + tipo;
    const fieldNamePrec3 = "precio3A" + tipo;*/

    /*if (typeof especie[fieldNameVol1] === "string")
      especie[fieldNameVol1] = parseFloat(especie[fieldNameVol1])
    if (typeof especie[fieldNameVol2] === "string")
      especie[fieldNameVol2] = parseFloat(especie[fieldNameVol2])
    if (typeof especie[fieldNameVol3] === "string")
      especie[fieldNameVol3] = parseFloat(especie[fieldNameVol3])*/

    if (tipo == 'Fustal') {
      var sumaVolumenes = especie.volumen1AFustal + especie.volumen2AFustal + especie.volumen3AFustal;

      valorMedio = (especie.precio1AFustal * especie.volumen1AFustal +
        especie.precio2AFustal * especie.volumen2AFustal +
        especie.precio3AFustal * especie.volumen3AFustal) /
        sumaVolumenes;
    } else if (tipo == 'Latizal') {
      var sumaVolumenes = especie.volumen1ALatizal + especie.volumen2ALatizal + especie.volumen3ALatizal;

      valorMedio = (especie.precio1ALatizal * especie.volumen1ALatizal +
        especie.precio2ALatizal * especie.volumen2ALatizal +
        especie.precio3ALatizal * especie.volumen3ALatizal) /
        sumaVolumenes;
    } else {
      var sumaVolumenes = especie.volumen1AMontebravo + especie.volumen2AMontebravo + especie.volumen3AMontebravo;

      valorMedio = (especie.precio1AMontebravo * especie.volumen1AMontebravo +
        especie.precio2AMontebravo * especie.volumen2AMontebravo +
        especie.precio3AMontebravo * especie.volumen3AMontebravo) /
        sumaVolumenes;
    }

    valorMedio = Number.parseFloat(valorMedio.toFixed(2));

    if (Number.isNaN(valorMedio))
      valorMedio = 0;

    return valorMedio;

  }
}
