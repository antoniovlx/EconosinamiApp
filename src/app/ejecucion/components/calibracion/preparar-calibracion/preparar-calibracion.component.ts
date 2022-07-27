import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DatosEjecucionService } from 'src/app/ejecucion/services/datos-ejecucion.service';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { AppService } from 'src/app/services/app.service';
import { HelperService } from 'src/app/services/helper.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { ZonasService } from 'src/app/zonas-analisis/components/zonas/services/zonas.service';
import { Bros } from 'src/entities/Bros';
import { DatosEjecucion } from 'src/entities/DatosEjecucion';
import { Medios } from 'src/entities/Medios';
import { Opciones } from 'src/entities/Opciones';
import { Zamif } from 'src/entities/Zamif';

class sZAMIF {
  idZamif: number;
  zamif: string;
  superficieDet: number;
  perimEsc: number;
  superficieEsc: number;
  horasEsc: number;
  LR: sLR[] = [];
};
class sLR {
  IdLR: number;
  lr: string;
  pc: number;
  breakROS: number[][] = []; // [Fil][BreakROS]
  runSize: number[]; // Calculados pctl-FIL
};

const Hectareas: number[] = [
  0.1,
  4.0,
  40.0,
  120.0,
  400.0
];

@Component({
  selector: 'app-preparar-calibracion',
  templateUrl: './preparar-calibracion.component.html',
  styleUrls: ['./preparar-calibracion.component.scss'],
})
export class PrepararCalibracionComponent implements OnInit {
  displayedColumns = ['titulo']

  opcionesEjecucion: Opciones[] = [];
  zamifList: Zamif[];
  ROS: number[] = [];
  selectedOpciones: Opciones[] = [];
  dataSource: MatTableDataSource<Opciones>;

  buttons = {
    refComponent: this,
    buttons: []
  }

  constructor(private zonasService: ZonasService, private ejecucionService: EjecucionService,
    private datosEjecucionService: DatosEjecucionService, private helperService: HelperService,
    private uiService: UiService, private appService: AppService) {
  }

  ngOnInit() {
    this.ejecucionService.getAllOpcionesEjecucion().subscribe(values => {
      this.opcionesEjecucion = values;
      this.dataSource = new MatTableDataSource<Opciones>(this.opcionesEjecucion);
    })

    this.zonasService.getAllZamif().subscribe(zamifList => {
      this.zamifList = zamifList;
    })
    this.setButtons();
  }

  setButtons() {
    this.buttons.buttons = [];
    this.buttons.buttons.push({ label: "Preparar calibración", action: "preparar", icon: "build", class: "blue-icon", disabled: this.selectedOpciones.length === 0 });
    this.appService.setActionButtonsChanged$(this.buttons);
  }


  preparar() {
    this.selectedOpciones.forEach(opcion => {
      this.prepararCalibracion(opcion);
      this.uiService.presentToast("Calibración preparada");
    })
  }

  prepararCalibracion(opcion: Opciones) {
    // leer lista Zamif y convertir en lista sZamif
    const sZamifList = this.leerZAMIF();
    for (let index = 0; index < sZamifList.length; index++) {
      const sZamif = sZamifList[index]
      sZamif.LR.forEach((sLr: sLR) => {
        this.rellenaTablaDatosEjecucion(opcion, sZamif, sLr).then(() => {
          let intensidades = [1, 2, 3, 4, 5, 6];
          intensidades.forEach(async intensidad => {
            this.datosEjecucionService.inicializaEjecuciones(opcion.idOpcion, sLr.IdLR, intensidad).then(() => {
              if (this.datosEjecucionService.datosEjecucion.length != 0) {
                this.breakROS(sZamif, sLr, intensidad);
                const bros = new Bros();
                bros.idOpcion = opcion;
                bros.idZamif = this.zamifList.find(zamif => zamif.idZamif == sZamif.idZamif);
                bros.idLr = bros.idZamif.lrs.find(lr => lr.idLr == sLr.IdLR);
                bros.intensidad = intensidad;

                for (let breakRos = 0; breakRos < 5; breakRos++) {
                  sLr.breakROS[intensidad - 1] = [this.ROS[breakRos]]
                  bros['ros' + (breakRos + 1)] = this.ROS[breakRos];
                }
                this.ejecucionService.saveOrUpdateBros(bros).subscribe();
              }
            })
          })
        })
      })
    }
  }

  isSelectedOpcion(idOpcion) {
    return this.selectedOpciones.includes(idOpcion);
  }


  updateOpcion(selected, opcion) {
    var index = this.selectedOpciones.indexOf(opcion);

    // selected + exist = no acción
    // not selected + exist = borrar 
    // selected + no exist = añadir
    // not selected + no exist = no acción

    if (!selected.checked && index != -1) {
      this.selectedOpciones.splice(index, 1);
    } else if (selected.checked && index == -1) {
      this.selectedOpciones.push(opcion)
    }

    this.setButtons();
  }


  async rellenaTablaDatosEjecucion(opcion: Opciones, zamif: sZAMIF, lr: sLR) {
    // borrar datos de ejecución
    this.ejecucionService.deleteDatosEjecucion(opcion.idOpcion, zamif.idZamif, lr.IdLR).subscribe();

    // borrar bros
    this.ejecucionService.deleteBros(opcion.idOpcion, zamif.idZamif, lr.IdLR).subscribe();

    // es necesario que exista un inventario generado
    let inventarios = await firstValueFrom(this.ejecucionService.getInventarioByOpcionLrDatosEjecucion(opcion.idOpcion, lr.IdLR));
    inventarios.forEach(inventario => {
      let tiempoLlegada = inventario.tiempoLlegada;
      const intensidad = inventario.intensidad;
      const idMedio = inventario.idMedio;
      const tipoUnidad = inventario.tipoUnidad;
      const tipoAeronave = inventario.tipoAeronave;
      const necesitaAgua = inventario.necesitaAgua;
      let rendimiento = inventario.rendimiento;
      const descarga = 0; /*AsDouble(dsRS, "Descarga")*/ /*¿¿??*/
      const costoUnitario = inventario.costoUnitarioPorMision;
      const costoRecarga = inventario.costoRecarga;
      let tiempoRecarga = inventario.tiempoRecarga;
      let maximoDescargas = inventario.maximoDescargas;
      let estado, costo;

      switch (tipoUnidad) {
        case 1:
          // Water Tender
          estado = 10; // Water Tender On Scene
          this.procesarEvento(opcion, zamif, lr, tiempoLlegada, intensidad, idMedio,
            rendimiento, 0.0, costoUnitario, estado);
          break;
        case 2:
          // Drops
          if (tiempoRecarga <= 1)
            tiempoRecarga = 1441;
          if (maximoDescargas <= 1)
            maximoDescargas = 1441;
          costo = costoUnitario;
          if (necesitaAgua) {
            estado = 31; // Drop Good IFF Water On Scene
          } else {
            estado = 30; // Drop Good IFF Ground Unit In Time
          }

          // se van dando pasadas con el medio hasta que que se llega al máximo de descargas
          while (maximoDescargas > 0 && tiempoLlegada <= 1440) {
            this.procesarEvento(opcion, zamif, lr, tiempoLlegada, intensidad, idMedio,
              0.0, descarga, costo, estado);
            tiempoLlegada += tiempoRecarga; // se suma al tiempo de llegada el tiempo de cada recarga
            --maximoDescargas; // se van gastando descargas
            costo = costoRecarga; // el costo es igual el costo de recarga
          }
          break;
        case 3:
          // Regular
          if (tipoAeronave == 'B')
            estado = 20; //Engine (Water) On Scene
          else
            estado = 40; // Other Unit On Scene
          this.procesarEvento(opcion, zamif, lr, tiempoLlegada, intensidad, idMedio,
            rendimiento, 0.0, costoUnitario, estado);
          if (tiempoRecarga > 0) {
            let tiempoParaRelleno = inventario.tiempoParaRelleno;
            tiempoLlegada += tiempoParaRelleno;
            rendimiento -= inventario.rendimientoRecargas;
            let refilling = true;
            while (tiempoLlegada <= 1440) {
              if (refilling)
                estado = 61; // Converts To Handcrew If Needs Water and No Water
              else
                estado = 62; // Resumes Full Production

              this.procesarEvento(opcion, zamif, lr, tiempoLlegada, intensidad, idMedio,
                (refilling ? -rendimiento : rendimiento), 0.0, 0.0, estado);
              tiempoLlegada += (refilling ? tiempoParaRelleno : tiempoRecarga);
              refilling = !refilling;
            }
          }
          break;
      }
    });
    this.procesarEvento(opcion, zamif, lr, 32100, 1, null, 0.0, 0.0, 0.0, 40);

  }

  procesarEvento(opcion: Opciones, sZamif: sZAMIF, sLr: sLR, tiempoLlegada: number, intensidad: number, idMedio: number, rendimiento: number, descarga: number, costoUnitario: number, estado: any) {
    const datosEjecucion = new DatosEjecucion();
    datosEjecucion.idOpcion = opcion;
    datosEjecucion.idZamif = this.zamifList.find(zamif => zamif.idZamif == sZamif.idZamif);
    datosEjecucion.idLr = datosEjecucion.idZamif.lrs.find(lr => lr.idLr == sLr.IdLR);
    datosEjecucion.minuto = tiempoLlegada;
    datosEjecucion.intensidad = intensidad;
    datosEjecucion.rendimiento = rendimiento;
    datosEjecucion.descarga = descarga;
    datosEjecucion.costoUnitario = costoUnitario;
    datosEjecucion.estado = estado;

    datosEjecucion.idMedio = new Medios(idMedio);

    this.ejecucionService.saveOrUpdateDatosEjecucion(datosEjecucion).subscribe();
  }


  breakROS(sZamif: sZAMIF, sLr: sLR, intensidad: number) {
    let gran, prevGran;

    for (let i = 0; i < 5; ++i)
      this.ROS[i] = 0;

    gran = 500.0;
    while (gran > 0.01) {
      prevGran = gran;
      if (gran == 500.0)
        gran = 10.24;
      else
        gran /= 4.0;
      for (let i = 0; i < 5; ++i) {
        const from = this.ROS[i] + gran;
        const to = this.ROS[i] + prevGran;
        for (let testROS = from; testROS <= to; testROS += gran) {
          const size = this.datosEjecucionService.calculaDatosEjecucion(sZamif, sLr, sZamif.superficieEsc, intensidad, testROS);
          if (size >= Hectareas[i])
            break;
          this.ROS[i] = testROS;
        }
      }
    }
  }



  leerZAMIF() {
    let sZamifList: sZAMIF[] = [];
    for (let index = 0; index < this.zamifList.length; index++) {
      const zamif = this.zamifList[index];

      const sZamif: sZAMIF = new sZAMIF();
      sZamif.idZamif = zamif.idZamif;
      sZamif.zamif = zamif.zamif;
      sZamif.superficieDet = zamif.superficieDet;
      sZamif.perimEsc = zamif.perimEsc;
      sZamif.horasEsc = zamif.horasEsc;
      sZamif.superficieEsc = this.helperService.areaByPerimetro(zamif.perimEsc); // 99999

      zamif.lrs.forEach(lr => {
        const sLr: sLR = new sLR();
        sLr.IdLR = lr.idLr;
        sLr.lr = lr.lr;
        sZamif.LR.push(sLr);
      })

      sZamifList.push(sZamif);
    }

    return sZamifList;
  }


}
