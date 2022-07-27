import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';
import { Actividades } from 'src/entities/Actividades';
import { CategoriaCostos } from 'src/entities/CategoriaCostos';
import { GrupoMedios } from 'src/entities/GrupoMedios';
import { Medios } from 'src/entities/Medios';
import { Presupuestos } from 'src/entities/Presupuestos';

@Component({
  selector: 'presupuestos-medio',
  templateUrl: './presupuestos-medio.component.html',
  styleUrls: ['./presupuestos-medio.component.scss'],
})
export class PresupuestosMedioComponent implements OnInit {
  displayedColumns: string[] = ['actividad', 'categoria', 'presupuesto'];

  actividades: Actividades[] = [];
  categorias: CategoriaCostos[] = [];

  @Input()
  medio: Medios;

  presupuestos: Presupuestos[];

  @Output() medioChanged = new EventEmitter<Medios>();

  @ViewChild(MatTable)
  table: MatTable<Presupuestos>;

  dataSource: MatTableDataSource<Presupuestos>;
  grupoMedios: GrupoMedios[];

  constructor(private appService: AppService, private mediosService: MediosService, public util: UtilService) { }

  ngOnInit() {
    if (this.medio.presupuestos == undefined || this.medio.presupuestos.length == 0) {
      this.presupuestos = [];
      this.addActividad();
    } else {
      this.presupuestos = this.medio.presupuestos;
    }

    this.dataSource = new MatTableDataSource<Presupuestos>(this.presupuestos);

    this.mediosService.getActividades().subscribe(result => {
      this.actividades = result;
    });

    this.mediosService.getCategoriaCostos().subscribe(result => {
      this.categorias = result;
    });
  }

  addActividad() {
    const presupuesto = new Presupuestos();
    presupuesto.idActividad = this.actividades[0];
    presupuesto.idCategoriaCosto = this.categorias[0];
    presupuesto.importe = 0;
    presupuesto.idMedio = this.medio;
    this.presupuestos.push(presupuesto)
  }

  addRow() {
    this.addActividad();
    this.table.renderRows();
  }

  removeRow() {
    const len = this.presupuestos.length;
    if (len > 1) {
      this.presupuestos.splice(len - 1, 1)
    }
    this.table.renderRows();
  }

  update(element: Presupuestos) {
    if (element.idActividad !== undefined && element.idCategoriaCosto !== undefined) {
      this.medio.presupuestos = this.presupuestos;
      this.medioChanged.emit(this.medio);
    }
  }
}
