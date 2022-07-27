import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActividadesRepository } from 'src/app/repositories/ActividadesRepository';
import { BasesRepository } from 'src/app/repositories/BasesRepository';
import { CategoriaCostosRepository } from 'src/app/repositories/CategoriaCostosRepository';
import { CategoriaMediosRepository } from 'src/app/repositories/CategoriaMediosRepository';
import { DistanciasRepository } from 'src/app/repositories/DistanciasRepository';
import { DreRepository } from 'src/app/repositories/DreRepository';
import { GrupoMediosRepository } from 'src/app/repositories/GrupoMediosRepository';
import { InventarioMediosRepository } from 'src/app/repositories/InventarioMedios';
import { MediosRepository } from 'src/app/repositories/MediosRepository';
import { RatiosProduccionRepository } from 'src/app/repositories/RatiosProduccionRepository';
import { TipoAeronaveRepository } from 'src/app/repositories/TipoAeronaveRepository';
import { Bases } from 'src/entities/Bases';
import { CategoriaMedios } from 'src/entities/CategoriaMedios';
import { Dre } from 'src/entities/Dre';
import { GrupoMedios } from 'src/entities/GrupoMedios';
import { InventarioMedios } from 'src/entities/InventarioMedios';
import { Medios } from 'src/entities/Medios';
import { Presupuestos } from 'src/entities/Presupuestos';
import { RatiosProduccion } from 'src/entities/RatiosProduccion';

@Injectable({
  providedIn: 'root'
})
export class MediosService {
  mediosChanged$ = new Subject<Medios>();
 

  constructor(private baseRepository: BasesRepository,
    private dreRepository: DreRepository,
    private mediosRepository: MediosRepository,
    private basesRepository: BasesRepository,
    private grupoMediosRepository: GrupoMediosRepository,
    private categoriaMediosRepository: CategoriaMediosRepository,
    private tipoAeronaveRepository: TipoAeronaveRepository,
    private actividadesRepository: ActividadesRepository,
    private inventarioMediosRepository: InventarioMediosRepository,
    private categoriaCostosRepository: CategoriaCostosRepository,
    private ratiosProduccionRepository: RatiosProduccionRepository,
    private distanciasRepository: DistanciasRepository) { }

  getBases() {
    return this.baseRepository.getAllBases();
  }

  getDreMedios() {
    return this.dreRepository.getAllDre();
  }

  getMedios() {
    return this.mediosRepository.getAllMedios();
  }

  getMediosChanged$(){
    return this.mediosChanged$;
  }

  getMediosWhereCalcularInventario(){
    return this.mediosRepository.getMediosWhereCalcularInventario();
  }

  getCountMediosWhereOpcionCategoria(idOpcion: number, idCategoriaMedios: number) {
    return this.mediosRepository.countMediosOpcionCategoria(idOpcion, idCategoriaMedios);
  }

  deleteDistanciaByBase(idBase: number) {
    return this.distanciasRepository.deleteDistanciasByBase(idBase);
  }

  setMediosChanged(medio: Medios){
    this.mediosChanged$.next(medio);
  }

  saveOrUpdateMedios(medio: Medios) {
    return this.mediosRepository.saveOrUpdateMedios(medio);
  }

  saveOrUpdatePresupuestos(presupuesto: Presupuestos) {
    return this.mediosRepository.saveOrUpdatePresupuestos(presupuesto);
  }

  saveOrUpdateMediosOpciones(idMedio: number, idOpcion: number){
    return this.mediosRepository.saveOrUpdateMediosOpciones(idMedio, idOpcion);
  }

  deleteMediosOpciones(idMedio: number, idOpcion: number){
    return this.mediosRepository.deleteMediosOpciones(idMedio, idOpcion);
  }

  deleteMedios(medio: Medios) {
    return this.mediosRepository.deleteMedios(medio);
  }

  updateMediosWhereVelocidadMenor0(velocidad: number) {
    return this.mediosRepository.updateWhereVelocidadMenor0(velocidad);
  }

  getGruposMedios() {
    return this.grupoMediosRepository.getAllGrupoMedios();
  }

  getCategoriasMedios() {
    return this.categoriaMediosRepository.getAllCategoriaMedios();
  }

  getCategoriasMediosExistingMedios() {
    return this.categoriaMediosRepository.getExistingMedios();
  }

  getTipoAeronaves() {
    return this.tipoAeronaveRepository.getAllTipoAeronave();
  }

  saveOrUpdateCategoriaMedios(categoria: CategoriaMedios) {
    return this.categoriaMediosRepository.saveCategoriaMedios(categoria);
  }
  
  deleteCategoriaMedios(categoria: CategoriaMedios){
    return this.categoriaMediosRepository.deleteCategoriaMedios(categoria);
  }

  saveOrUpdateBases(base: Bases) {
    return this.basesRepository.saveOrUpdateBases(base);
  }
  
  deleteBases(base: Bases){
    return this.basesRepository.deleteBases(base);
  }

  saveOrUpdateDreMedios(dre: Dre) {
    return this.dreRepository.saveOrUpdateDre(dre);
  }

  deleteDreMedios(dre: Dre) {
    return this.dreRepository.deleteDre(dre);
  }

  getActividades() {
    return this.actividadesRepository.getAllActividades();
  }

  getCategoriaCostos(){
    return this.categoriaCostosRepository.getAllCategoriaCostos();
  } 

  saveOrUpdateGrupoMedios(grupo: GrupoMedios){
    return this.grupoMediosRepository.saveOrUpdateGrupoMedios(grupo);
  }

  deleteGruposMedios(grupo: GrupoMedios) {
    return this.grupoMediosRepository.deleteGrupoMedios(grupo);
  }

  getRatiosByGrupoMedio(idGrupoMedios: any) {
    return this.ratiosProduccionRepository.getRatiosByGrupoMedio(idGrupoMedios);
  }

  saveOrUpdateRatiosMedios(ratio: RatiosProduccion) {
    return this.ratiosProduccionRepository.saveOrUpdateRatiosProduccion(ratio);
  }

  deleteRatiosMediosByGrupoMedio(idGrupoMedio: number) {
    return this.ratiosProduccionRepository.deleteRatiosProduccionByGrupoMedio(idGrupoMedio);
  }

  getRatiosByGrupoMedioAndModelo(idGrupoMedios: number, modelo: number) {
    return this.ratiosProduccionRepository.getRatiosByGrupoMedioAndModelo(idGrupoMedios, modelo);
  }


  getInventarioMediosByMedio(idlr: number, idMedio: number) {
    return this.inventarioMediosRepository.getByMedio(idlr, idMedio);
  }
  getMediosByLrs(idLrs: number[]) {
    return this.mediosRepository.getByLrs(idLrs);
  }

}
