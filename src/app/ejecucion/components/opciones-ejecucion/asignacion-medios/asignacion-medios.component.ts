import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Configuracion } from 'src/entities/Configuracion';
import { Medios } from 'src/entities/Medios';
import { Opciones } from 'src/entities/Opciones';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AppService, IDataContainer } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';
import { EjecucionService } from 'src/app/ejecucion/services/ejecucion.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { firstValueFrom } from 'rxjs';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { UiService } from 'src/app/services/ui.service';

class SumCost {
  constructor(opcion, suma) {
    this.opcion = opcion
    this.suma = suma
  }
  opcion: number
  suma: number
}

interface PresupuestoMedio {
  idMedio: number;
  presupuesto: number;
}

interface MedioNode {
  idMedio?: number;
  nombre?: string;
  coste?: number;
  seleccionado?: boolean[];
  children?: MedioNode[];
  countMedios?: number;
}

/*const TREE_DATA: MedioNode[] = [
  {
    nombre: 'Fruit',
    children: [
      { nombre: 'Apple', coste: 10 },
      { nombre: 'Banana', coste: 20 },
    ]
  }, {
    nombre: 'Fruit',
    children: [
      { nombre: 'Apple', coste: 10 },
      { nombre: 'Banana', coste: 20 },
    ]
  }
];*/

interface ExampleFlatNode {
  expandable: boolean;
  nombre: string;
  coste: number;
  seleccionado: boolean[];
  level: number;
}


@Component({
  selector: 'asignacion-medios',
  templateUrl: './asignacion-medios.component.html',
  styleUrls: ['./asignacion-medios.component.scss'],
})
export class AsignacionMediosComponent implements OnInit, IDataContainer {
  currency: any;

  @Input()
  data: any;

  @Output() dataSaved = new EventEmitter<Medios[]>();

  mediosList: Medios[] = [];
  presupuestosMedios: PresupuestoMedio[] = [];

  treeData: MedioNode[] = [];
  opcionesList: Opciones[];

  //displayedColumns: string[] = ['AGRUPACION', 'MEDIO', 'COSTE'];
  displayedColumns: string[] = ['medio', 'coste'];
  maximoTotalColumns: string[] = ['maximo'];
  usadoTotalColumns: string[] = ['usado'];
  disponibleTotalColumns: string[] = ['disponible'];


  private transformer = (node: MedioNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      idMedio: node.idMedio,
      nombre: node.nombre,
      coste: node.coste,
      seleccionado: node.seleccionado,
      countMedios: node.countMedios,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  translations: string[] = [];

  presupuestoMax: SumCost[] = [];
  presupuestoUsado: SumCost[] = [];
  configuracion: Configuracion;
  param: { moneda: string; };

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  categoriasMedios: CategoriaMedios[];

  constructor(private appService: AppService,
    private ejecucionService: EjecucionService,
    private utilService: UtilService,
    private mediosService: MediosService,
    private uiService: UiService) { }



  ngOnInit() {
    this.currency = this.utilService.getMoneda();

    this.initData();

    this.ejecucionService.getOpcionesChanged$().asObservable().subscribe(opciones => {
      this.displayedColumns = ['medio', 'coste'];
      this.maximoTotalColumns = ['maximo'];
      this.usadoTotalColumns = ['usado'];
      this.disponibleTotalColumns = ['disponible'];
      this.presupuestoMax = [];
      this.presupuestoUsado = [];
      this.mediosList = [];
      this.opcionesList = [];
      this.treeData = [];
      this.initData();
    });
  }

  initData() {
    let opciones = this.data.opciones;
    opciones.forEach(opcion => {
      this.displayedColumns.push(opcion.idOpcion.toString())
      this.maximoTotalColumns.push("maximo-" + opcion.idOpcion.toString())
      this.usadoTotalColumns.push("usado-" + opcion.idOpcion.toString())
      this.disponibleTotalColumns.push("disponible-" + opcion.idOpcion.toString())
    })
    this.opcionesList = opciones;
    opciones.forEach(opcion => {
      this.presupuestoMax.push(new SumCost(opcion.idOpcion, opcion.presupuesto));
      this.presupuestoUsado.push(new SumCost(opcion.idOpcion, 0));
    });

    this.getPresupuestosMedios();
  }

  private loadData() {
    let categorias = this.data.categoriaMedios;
    categorias.forEach(categoria => {
      let agrupamiento = "(" + categoria.categoriaMedios + ") " + categoria.descripcion;
      let medios = [];
      categoria.medios.forEach(medio => {
        // para cada medio
        let seleccionados = [];
        this.opcionesList.forEach(opcion => {
          seleccionados.push(this.getSeleccionado(opcion.idOpcion, medio));
        });

        medios.push({ idMedio: medio.idMedio, nombre: "(" + medio.medio + ") " + medio.descripcion, coste: this.getPresupuesto(medio.idMedio), seleccionado: seleccionados });
        this.mediosList.push(medio);

      });
      if (medios.length > 0) {
        this.treeData.push({
          nombre: agrupamiento,
          children: medios,
          countMedios: medios.length
        });
      }

    });

    this.dataSource.data = this.treeData;

    if (this.treeControl.dataNodes.length >= 2) {
      this.treeControl.expand(this.treeControl.dataNodes[0]);
      this.treeControl.expand(this.treeControl.dataNodes[2]);
    }

  }

  private getPresupuestosMedios() {
    this.ejecucionService.getPresupuestosMedios().subscribe((presupuestos: PresupuestoMedio[]) => {
      this.presupuestosMedios = presupuestos;
      this.loadData();
    });
  }

  getPresupuesto(idMedio) {
    let presupuesto = this.presupuestosMedios.find(presupuestoMedio => presupuestoMedio.idMedio == idMedio)
    return presupuesto.presupuesto;
  }

  getPresupuestoDisponible(column: string) {
    let idOpcion = column.split('-')[1]
    let usado = this.presupuestoUsado.find(element => element.opcion === Number.parseInt(idOpcion)).suma
    let max = this.presupuestoMax.find(element => element.opcion === Number.parseInt(idOpcion)).suma
    return max - usado;
  }

  getPresupuestoMaximo(column: string) {
    let idOpcion = column.split('-')[1]
    return this.presupuestoMax.find(element => element.opcion === Number.parseInt(idOpcion)).suma
  }

  getPresupuestoUsado(column: string) {
    let idOpcion = column.split('-')[1]
    return this.presupuestoUsado.find(element => element.opcion === Number.parseInt(idOpcion)).suma
  }

  getColumnName(column) {
    // get nombre opcion de ejecucion ( idOpcion => nombreOpcion)
    const opcion = this.opcionesList.find(opcion => opcion.idOpcion === parseInt(column));
    return "(" + opcion.opcion + ") " + opcion.descripcion;
  }

  getSeleccionado(idOpcion: number, medio: Medios) {
    const opcion = medio.opciones.find(opcion => opcion.idOpcion === idOpcion);
    const undef = opcion === undefined;
    var seleccionado = undef ? false : true;
    let index = 0;

    if (seleccionado) {
      // seleccionado
      index = this.presupuestoUsado.findIndex(element => element.opcion === opcion.idOpcion)
      this.presupuestoUsado[index].suma += this.getPresupuesto(medio.idMedio)
    }

    // seleccionado y no seleccionado
    //index = this.presupuestoMax.findIndex(element => element.opcion === idOpcion)
    //this.presupuestoMax[index].suma += medio.costeBasico;

    return seleccionado;
  }

  getSeleccionadoColumn(seleccionado: boolean[], column: number) {
    return seleccionado[column - 2];
  }

  onChangeSeleccionado(event: MatCheckboxChange, data: MedioNode, column: string) {
    const opcion = this.opcionesList.find(opcion => opcion.idOpcion === parseInt(column));
    let index = this.presupuestoUsado.findIndex(element => element.opcion === opcion.idOpcion);
    var usado = this.presupuestoUsado[index].suma;

    if (event.checked) {
      this.presupuestoUsado[index].suma = usado + data.coste;
    } else {
      this.presupuestoUsado[index].suma = usado - data.coste;
    }

    this.updateMedios(data.idMedio, opcion, event.checked);
  }

  updateMedios(idMedio: number, opcion: Opciones, seleccionado: boolean) {
    /*const indexMedio = this.mediosList.findIndex(medio => medio.idMedio == idMedio);
    if (seleccionado) {
      // añadir opción
      this.mediosList[indexMedio].opciones.push(opcion);
    } else {
      // borrar opción
      const indexOpcion = this.mediosList[indexMedio].opciones.findIndex(element => element.idOpcion == opcion.idOpcion);
      this.mediosList[indexMedio].opciones.splice(indexOpcion, 1);
    }

    this.dataSaved.emit(this.mediosList);*/

    if (seleccionado) {
      this.mediosService.saveOrUpdateMediosOpciones(idMedio, opcion.idOpcion).subscribe();
    } else {
      this.mediosService.deleteMediosOpciones(idMedio, opcion.idOpcion).subscribe()
    }
  }

}
