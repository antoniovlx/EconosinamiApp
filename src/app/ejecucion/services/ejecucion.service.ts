import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ArfRepository } from 'src/app/repositories/ArfRepository';
import { BrosRepository } from 'src/app/repositories/BrosRepository';
import { CategoriaMediosRepository } from 'src/app/repositories/CategoriaMediosRepository';
import { DatosEjecucionRepository } from 'src/app/repositories/DatosEjecucionRepository';
import { DreRepository } from 'src/app/repositories/DreRepository';
import { EjecucionesRepository } from 'src/app/repositories/EjecucionesRepository';
import { FdrRepository } from 'src/app/repositories/FdrRepository';
import { GruposCnvrRepository } from 'src/app/repositories/GruposCnvrRepository';
import { GruposEjecucionRepository } from 'src/app/repositories/GruposEjecucionRepository';
import { HistoricoFuegosRepository } from 'src/app/repositories/HistoricoFuegosRepository';
import { IntensidadActivacionRepository } from 'src/app/repositories/IntensidadActivacionRepository';
import { InventarioMediosRepository } from 'src/app/repositories/InventarioMedios';
import { LrRepository } from 'src/app/repositories/LrRepository';
import { MaderasRepository } from 'src/app/repositories/MaderasRepository';
import { MediosRepository } from 'src/app/repositories/MediosRepository';
import { OpcionesRepository } from 'src/app/repositories/OpcionesRepository';
import { SimulacionRepository } from 'src/app/repositories/SimulacionRepository';
import { TamanosIntensidadRepository } from 'src/app/repositories/TamanosIntensidadRepository';
import { Arf } from 'src/entities/Arf';
import { Bros } from 'src/entities/Bros';
import { Cnvr } from 'src/entities/Cnvr';
import { DatosEjecucion } from 'src/entities/DatosEjecucion';
import { Ejecuciones } from 'src/entities/Ejecuciones';
import { Fdr } from 'src/entities/Fdr';
import { Fdrlr } from 'src/entities/Fdrlr';
import { GruposEjecucion } from 'src/entities/GruposEjecucion';
import { HistoricoFuegos } from 'src/entities/HistoricoFuegos';
import { IntensidadActivacion } from 'src/entities/IntensidadActivacion';
import { InventarioMedios } from 'src/entities/InventarioMedios';
import { Opciones } from 'src/entities/Opciones';


@Injectable({ providedIn: "root" })
export class EjecucionService {
 

  opcionesList$ = new Subject<Opciones[]>();

  constructor(private fdrRepository: FdrRepository,
    private gruposEjecucionRepository: GruposEjecucionRepository,
    private dreRepository: DreRepository,
    private arfRepository: ArfRepository,
    private opcionesRepository: OpcionesRepository,
    private mediosRepository: MediosRepository,
    private categoriasMediosRepository: CategoriaMediosRepository,
    private gruposCnvrRepository: GruposCnvrRepository,
    private maderaRepository: MaderasRepository,
    private lrRepository: LrRepository,
    private inventarioRepository: InventarioMediosRepository,
    private historicoFuegosRepository: HistoricoFuegosRepository,
    private datosEjecucionRepository: DatosEjecucionRepository,
    private brosRepository: BrosRepository,
    private intensidadActivacionRepository: IntensidadActivacionRepository,
    private ejecucionesRepository: EjecucionesRepository,
    private tamanosIntensidadRepository: TamanosIntensidadRepository,
    private simulacionRepository: SimulacionRepository) { }

  getOpcionesChanged$() {
    return this.opcionesList$;
  }

  getAllFdr() {
    return this.fdrRepository.getAllFdr();
  }

  saveOrUpdateArf(arf: Arf) {
    return this.arfRepository.saveOrUpdateArf(arf);
  }
  saveOrUpdateFdr(fdr: Fdr) {
    return this.fdrRepository.saveOrUpdateFdr(fdr);
  }

  saveOrUpdateFdrlr(fdrlr: Fdrlr){
    return this.fdrRepository.saveOrUpdateFdrlr(fdrlr);
  }

  getAllFdrlrByOpcion(idOpcion: number) {
    return this.fdrRepository.getFdrlrByOpcion(idOpcion);
  }

  getAllFdrlrByOpcionLr(idOpcion: number, idLr: number) {
    return this.fdrRepository.getFdrlrByOpcionLr(idOpcion, idLr);
  }

  deleteFdr(fdr: Fdr) {
    return this.fdrRepository.deleteFdr(fdr);
  }

  deleteArfByDre(idDre: number) {
    return this.arfRepository.deleteArfByDre(idDre);
  }
  deleteArfByFdr(idFdr: number) {
    return this.arfRepository.deleteArfByFdr(idFdr);
  }

  deleteFdrlrByOpcion(opcion: Opciones) {
    return this.fdrRepository.deleteFdrlrByOpciones(opcion);
  }

  getAllGruposEjecucion() {
    return this.gruposEjecucionRepository.getAllGruposEjecucion();
  }

  saveGrupoEjecucion(grupoEjecucion: GruposEjecucion) {
    return this.gruposEjecucionRepository.saveOrUpdateGruposEjecucion(grupoEjecucion);
  }

  deleteGrupoEjecucion(grupoEjecucion: GruposEjecucion) {
    return this.gruposEjecucionRepository.deleteGruposEjecucion(grupoEjecucion);
  }

  saveOrUpdateCnvr(cnvr: Cnvr) {
    return this.gruposCnvrRepository.saveOrUpdateCnvr(cnvr);
  }

  getDreMedios() {
    return this.dreRepository.getAllDre();
  }
  getArfByFdr(idFdr: any) {
    return this.arfRepository.gellAllByFdr(idFdr);
  }

  getAllOpcionesEjecucion() {
    return this.opcionesRepository.getAllOpciones();
  }

  saveOrUpdateOpcionesEjecucion(opcion: Opciones) {
    return this.opcionesRepository.saveOrUpdateOpciones(opcion);
  }

  saveOrUpdateOpciones(opcion: Opciones) {
    return this.opcionesRepository.saveOrUpdateOpciones(opcion);
  }

  deleteOpcionesEjecucion(opcion: Opciones) {
    return this.opcionesRepository.deleteOpciones(opcion);
  }

  getCategoriasMediosCompleto() {
    return this.categoriasMediosRepository.getAllCompleto();
  }

  getPresupuestosMedios() {
    return this.mediosRepository.getPresupuestosMedios();
  }

  getGruposCnvr() {
    return this.gruposCnvrRepository.getAllGruposCnvr();
  }

  getCnvrByGrupoCnvr(selectedGrupoCnvr: number) {
    return this.gruposCnvrRepository.getCnvrByGrupoCnvr(selectedGrupoCnvr);
  }

  getIntensidadFustalByValor(intensidad: number) {
    return this.maderaRepository.getIntensidadFustalByValor(intensidad);
  }

  getIntensidadMontebravoByValor(intensidad: number) {
    return this.maderaRepository.getIntensidadMontebravoByValor(intensidad);
  }

  getIntensidadLatizalByValor(intensidad: number) {
    return this.maderaRepository.getIntensidadLatizalByValor(intensidad);
  }

  getInventarioMedios(selectedLr: number) {
    return this.inventarioRepository.getAllInventarioMedios(selectedLr);
  }

  deleteInventarioByMedio() {
    return this.inventarioRepository.deleteByMedio();
  }

  deleteInventarioByLr(idLr: number) {
    return this.inventarioRepository.deleteByLr(idLr);
  }
 

  getInventarioByOpcionLr(idOpcion: number, idLr: number) {
    return this.inventarioRepository.getInventarioByOpcionLr(idOpcion, idLr);
  }

  getInventarioByOpcionLrDatosEjecucion(idOpcion: number, idLr: number) {
    return this.inventarioRepository.getInventarioByOpcionLrDatosEjecucion(idOpcion, idLr);
  }

  saveOrUpdateInventarioMedios(inventario: InventarioMedios) {
    return this.inventarioRepository.saveOrUpdateInventarioMedios(inventario);
  }

  saveOrUpdateIntensidadActivacion(intensidad: IntensidadActivacion) {
    return this.intensidadActivacionRepository.saveOrUpdateIntensidadActivacion(intensidad);
  }

  getMediosIntensidadActivacion(idOpcion: number) {
    return this.mediosRepository.getMediosIntensidadActivacion(idOpcion);
  }
  deleteIntensidadActivacionByOpcionZamif(idOpcion: number, idZamif: number) {
    return this.intensidadActivacionRepository.deleteByOpcionZamif(idOpcion, idZamif);
  }


  deleteIntensidadActivacionByOpcionLr(idOpcion: number, idLr: number) {
    return this.intensidadActivacionRepository.deleteByOpcionLr(idOpcion, idLr);
  }

  getIntensidadActivacionByOpcionAndLr(idOpcion: number, idLr: number) {
    return this.intensidadActivacionRepository.getIntensidadActivacionByOpcionAndLr(idOpcion, idLr);
  }


  getHistoricoFuegos(selectedZamif: number) {
    return this.historicoFuegosRepository.getAllHistoricoFuegosByZamif(selectedZamif);
  }

  saveOrUpdateHistoricoFuegos(historico: HistoricoFuegos) {
    return this.historicoFuegosRepository.saveOrUpdateHistoricoFuegos(historico);
  }

  deleteHistoricoFuegosByZamif(idZamif: number){
    return this.historicoFuegosRepository.deleteHistoricoByZamif(idZamif);
  }

  // Datos de Ejecución
  getDatosEjecucion(idOpcion: number, IdLR: number, intensidad: number) {
    return this.datosEjecucionRepository.getAllDatosEjecucion(idOpcion, IdLR, intensidad);
  }
  
  getDatosEjecucionFirstWater(idOpcion: number, IdLR: number, intensidad: number) {
    return this.datosEjecucionRepository.getFirstWater(idOpcion, IdLR, intensidad);
  }

  getDatosEjecucionFirstGround(idOpcion: number, IdLR: number, intensidad: number) {
    return this.datosEjecucionRepository.getFirstGround(idOpcion, IdLR, intensidad);
  }

  saveOrUpdateDatosEjecucion(datosEjecucion: DatosEjecucion) {
    return this.datosEjecucionRepository.saveDatosEjecucion(datosEjecucion);
  }

  deleteDatosEjecucion(idOpcion: number, idZamif: number, idLr: number) {
    return this.datosEjecucionRepository.deleteDatosEjecucion(idOpcion, idZamif, idLr);
  }

  getEjecucionesByParameters(IdZAMIF: number, IdGDCF: number, IdOpcion: number) {
    return this.ejecucionesRepository.getAllByParameters(IdZAMIF, IdGDCF, IdOpcion);
  }

  getEjecucionById(idEjecucion: any) {
    return this.ejecucionesRepository.getEjecucionById(idEjecucion);
  }

  // Bros

  deleteBros(idOpcion: number, idZamif: number, idLr: number) {
    return this.brosRepository.deleteBros(idOpcion, idZamif, idLr);
  }

  saveOrUpdateBros(bros: Bros) {
    return this.brosRepository.saveBros(bros);
  }

  getTamanosIntensidad() {
    return this.tamanosIntensidadRepository.getAllTamanosIntensidad();
  }

  saveOrUpdateEjecuciones(ejecucion: Ejecuciones) {
    return this.ejecucionesRepository.saveOrUpdateEjecuciones(ejecucion);
  }

  
  getMaxIdEjecucion() {
    return this.ejecucionesRepository.getMaxIdEjecucion();
  }

  deleteEjecucion(idEjecucion: number) {
    return this.ejecucionesRepository.deleteEjecucion(idEjecucion);
  }

  deleteEjecuciones(idEjecuciones: Ejecuciones){
    return this.ejecucionesRepository.deleteEjecuciones(idEjecuciones);
  }

  getResumenFuegosEjecucion(idEjecucion: number, idLr: number) {
    return this.ejecucionesRepository.getResumenFuegosAnualesEjecucion(idEjecucion, idLr);
  }


  getEjecucionWhereParemeters(idEjecucion: number, intensidad: number, sumParam: string, whereSize: string) {
    return this.ejecucionesRepository.getEjecucionWhereParemeters(idEjecucion, intensidad, sumParam, whereSize);
  }


  getSimulacionConsulta(intensidad: number, IdOpcion: number, IdLR: number) {
    return this.simulacionRepository.getSimulacionConsulta(intensidad, IdOpcion, IdLR);
  }

  insertarEjecucionSimulacion(consulta: string) {
    return this.simulacionRepository.saveOrUpdateEjecucion(consulta);
  }
}
