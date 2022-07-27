import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { AppService } from 'src/app/services/app.service';
import { Bases } from 'src/entities/Bases';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { Dre } from 'src/entities/Dre';
import { GrupoMedios } from 'src/entities/GrupoMedios';
import { Medios } from 'src/entities/Medios';
import { TipoAeronave } from 'src/entities/TipoAeronave';

@Component({
  selector: 'datos-generales-medio',
  templateUrl: './datos-generales-medio.component.html',
  styleUrls: ['./datos-generales-medio.component.scss'],
})
export class DatosGeneralesMedioComponent implements OnInit {

  selectedGrupoMedio: number;
  selectedTipoUnidad: string;
  selectedAgrupacion: number;
  selectedCategoria: number;
  selectedTipoAeronave: string;
  selectedBase: number;

  tipoAeronaves: TipoAeronave[];

  @Input()
  medio: Medios

  @Input()
  grupoMedios: GrupoMedios[];

  @Input()
  agrupacionesMedios: Dre[];

  @Input()
  categoriasMedios: CategoriaMedios[];

  @Input()
  bases: Bases[];

  @Output() medioChanged = new EventEmitter<Medios>();
  @Output() grupoMedioChanged = new EventEmitter<GrupoMedios>();

  constructor(private appService: AppService, private mediosService: MediosService) { }

  ngOnInit() {
    if (this.medio.tipoUnidad !== null && this.medio.tipoUnidad !== undefined)
      this.selectedTipoUnidad = this.medio.tipoUnidad.toString();

    this.getGruposMedios();

    this.getDreMedios();

    this.getCategoriasMedios();

    this.getBases();

    this.getTiposAeronaves();

  }

  getTiposAeronaves() {
    this.mediosService.getTipoAeronaves().subscribe(result => {
      this.tipoAeronaves = result;
      this.selectedTipoAeronave = this.medio.tipoAeronave;
    });
  }

  getBases() {
    this.selectedBase = this.medio.idBase?.idBase;
  }
  getCategoriasMedios() {
    this.selectedCategoria = this.medio.idCategoriaMedios?.idCategoriaMedios;
  }

  getDreMedios() {
    this.selectedAgrupacion = this.medio.idDre?.idDre;
  }

  getGruposMedios() {
    this.selectedGrupoMedio = this.medio.idGrupoMedios?.idGrupoMedios;
  }

  changeGrupoMedio(event) {
    this.selectedGrupoMedio = event.detail.value;

    const grupoMedio = this.grupoMedios.filter(grupo => grupo.idGrupoMedios === this.selectedGrupoMedio);

    if (grupoMedio.length !== 0) {
      this.selectedTipoUnidad = grupoMedio[0].tipoUnidad.toString();
      this.selectedTipoAeronave = grupoMedio[0].tipoAeronave.idTipoAeronave;

      this.medio.idGrupoMedios = grupoMedio[0]
    }

    this.grupoMedioChanged.emit(grupoMedio[0]);

    //this.medio.tipoUnidad = parseInt(this.selectedTipoUnidad);
    //this.medio.tipoAeronave = this.selectedTipoAeronave;
  }

  changeTipoUnidadSelected(event) {
    this.selectedTipoUnidad = event.detail.value;
    this.medio.tipoUnidad = parseInt(this.selectedTipoUnidad);
  }

  changeTipoMedio(event) {
    this.selectedCategoria = event.detail.value;

    const categoria = this.categoriasMedios.filter(categoria => categoria.idCategoriaMedios === this.selectedCategoria)

    if (categoria.length !== 0)
      this.medio.idCategoriaMedios = categoria[0];
  }

  changeAgrupacion(event) {
    this.selectedAgrupacion = event.detail.value;

    const agrupacion = this.agrupacionesMedios.filter(agrupacion => agrupacion.idDre === this.selectedAgrupacion);

    if (agrupacion.length !== 0)
      this.medio.idDre = agrupacion[0];

  }

  changeBase(event) {
    this.selectedBase = event.detail.value;
    const base = this.bases.filter(base => base.idBase === this.selectedBase);

    if (base.length !== 0)
      this.medio.idBase = base[0];
  }

  changeTipoAeronave(event) {
    this.selectedTipoAeronave = event.detail.value;
    this.medio.tipoAeronave = this.selectedTipoAeronave;
  }

  changeMedio() {
    this.medioChanged.emit(this.medio);
  }
}
