import { Injectable } from '@angular/core';
import { EspecieRepository } from 'src/app/repositories/EspecieRepository';
import { GruposCnvrRepository } from 'src/app/repositories/GruposCnvrRepository';
import { GruposMaderasRepository } from 'src/app/repositories/GruposMaderasRepository';
import { MaderasRepository } from 'src/app/repositories/MaderasRepository';
import { RecursosForestalesRepository } from 'src/app/repositories/RecursosForestalesRepository';
import { Cnvr } from 'src/entities/Cnvr';
import { CnvrLr } from 'src/entities/CnvrLr';
import { Especie } from 'src/entities/Especies';
import { Fustal } from 'src/entities/Fustal';
import { GrupoCnvr } from 'src/entities/GrupoCnvr';
import { GrupoFustal } from 'src/entities/GrupoFustal';
import { GrupoLatizal } from 'src/entities/GrupoLatizal';
import { GrupoMontebravo } from 'src/entities/GrupoMontebravo';
import { Latizal } from 'src/entities/Latizal';
import { Montebravo } from 'src/entities/Montebravo';
import { RecursosForestales } from 'src/entities/RecursosForestales';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {
  constructor(private especiesRepository: EspecieRepository,
    private recursosForestalesRepository: RecursosForestalesRepository,
    private gruposMaderasRepository: GruposMaderasRepository,
    private gruposCnvrRepository: GruposCnvrRepository,
    private maderasRepository: MaderasRepository
  ) { }

  // Especies
  getEspeciesList() {
    return this.especiesRepository.getAllEspecies();
  }

  saveOrUpdateEspecie(especie: Especie) {
    return this.especiesRepository.saveOrUpdateEspecie(especie);
  }

  deleteEspecie(especie: Especie){
    return this.especiesRepository.deleteEspecie(especie);
  }

  getEspecieById(idEspecie: number) {
    return this.especiesRepository.getEspecieById(idEspecie);
  }

  // Recursos
  getRecursosList() {
    return this.recursosForestalesRepository.getAllRecursos();
  }

  saveOrUpdateRecursos(recurso: RecursosForestales) {
    return this.recursosForestalesRepository.saveOrUpdateRecursos(recurso);
  }

  deleteRecursos(recursos: RecursosForestales){
    return this.recursosForestalesRepository.deleteRecursos(recursos);
  }

  // Grupos Maderas
  getGruposFustalList() {
    return this.gruposMaderasRepository.getAllGruposFustal();
  }

  getGruposLatizalList() {
    return this.gruposMaderasRepository.getAllGruposLatizal();
  }

  getGruposMontebravoList() {
    return this.gruposMaderasRepository.getAllGruposMontebravo();
  }

  getFustalByGrupo(idGrupoFustal: number) {
    return this.maderasRepository.getAllByGrupoFustal(idGrupoFustal);
  }

  saveOrUpdateGrupoFustal(fustal: GrupoFustal){
    return this.gruposMaderasRepository.saveOrUpdateGrupoFustal(fustal);
  }

  deleteGrupoFustal(grupo: GrupoFustal){
    return this.gruposMaderasRepository.deleteGrupoFustal(grupo);
  }

  deleteGrupoLatizal(grupo: GrupoLatizal){
    return this.gruposMaderasRepository.deleteGrupoLatizal(grupo);
  }

  deleteGrupoMontebrevo(grupo: GrupoMontebravo){
    return this.gruposMaderasRepository.deleteGrupoMontebravo(grupo);
  }

  deleteFustalByEspecie(idEspecie: number){
    return this.maderasRepository.deleteFustalByEspecie(idEspecie);
  }

  deleteLatizalByEspecie(idEspecie: number){
    return this.maderasRepository.deleteLatizalByEspecie(idEspecie);
  }

  deleteMontebravoByEspecie(idEspecie: number){
    return this.maderasRepository.deleteMontebravoByEspecie(idEspecie);
  }

  getLatizalByGrupo(idGrupoLatizal: number) {
   return this.maderasRepository.getAllByGrupoLatizal(idGrupoLatizal);
  }

  saveOrUpdateGrupoLatizal(latizal: GrupoLatizal){
    return this.gruposMaderasRepository.saveOrUpdateGrupoLatizal(latizal);
  }


  getMontebravoByGrupo(idGrupoMontebravo: number) {
    return this.maderasRepository.getAllByGrupoMontebravo(idGrupoMontebravo);
  }

  saveOrUpdateGrupoMontebravo(montebravo: GrupoMontebravo){
    return this.gruposMaderasRepository.saveOrUpdateGrupoMontebravo(montebravo);
  }

  saveOrUpdateFustal(fustal: Fustal){
    return this.maderasRepository.saveOrUpdateFustal(fustal);
  }

  saveOrUpdateLatizal(latizal: Latizal){
    return this.maderasRepository.saveOrUpdateLatizal(latizal);
  }

  saveOrUpdateMontebravo(montebravo: Montebravo){
    return this.maderasRepository.saveOrUpdateMontebravo(montebravo);
  }

  // Grupo CNVR

  getGrupoCnvrList() {
    return this.gruposCnvrRepository.getAllGruposCnvr();
  }

  getCnvrByGrupoCnvr(idGrupoCnvr: number, bloqueado?: boolean) {
    return this.gruposCnvrRepository.getCnvrByGrupoCnvr(idGrupoCnvr, bloqueado);
  }

  saveOrUpdateGrupoCnvr(grupo: GrupoCnvr){
    return this.gruposCnvrRepository.saveOrUpdateGrupoCnvr(grupo);
  }

  deleteGrupoCnvr(grupo: GrupoCnvr){
    return this.gruposCnvrRepository.deleteGrupoCnvr(grupo);
  }

  deleteCnvrByGrupoCnvr(idGcnvr: number){
    return this.gruposCnvrRepository.deleteCnvrByGrupoCnvr(idGcnvr);
  }

  deleteCnvrByRecurso(idRecursoForestal: number) {
    return this.gruposCnvrRepository.deleteCnvrByRecurso(idRecursoForestal);
  }


  deleteCnvrLrByGrupoCnvr(idGcnvr: number){
    return this.gruposCnvrRepository.deleteCnvrLrByGrupoCnvr(idGcnvr);
  }

  saveOrUpdateCnvr(cnvr: Cnvr){
    return this.gruposCnvrRepository.saveOrUpdateCnvr(cnvr);
  }

  getGrupoCnvrByZamif(idLrs: any[]) {
    return this.gruposCnvrRepository.getCnvrLrByZamif(idLrs);
  }


  getCnvrLrByLr(idLr: number) {
    return this.gruposCnvrRepository.getCnvrLrByLr(idLr);
  }

  saveOrUpdateCnvrlr(cnvrlr: CnvrLr){
    return this.gruposCnvrRepository.saveOrUpdateCnvrLr(cnvrlr);
  }

  // 
  calcularValorMedioFustal(especie: Especie): number {

    if (typeof especie.volumen1AFustal === "string")
      parseFloat(especie.volumen1AFustal)
    if (typeof especie.volumen2AFustal === "string")
      parseFloat(especie.volumen2AFustal)
    if (typeof especie.volumen3AFustal === "string")
      parseFloat(especie.volumen3AFustal)


    var sumaVolumenes = especie.volumen1AFustal + especie.volumen2AFustal + especie.volumen3AFustal;

    let valorMedioFustal = (especie.precio1AFustal * especie.volumen1AFustal +
      especie.precio2AFustal * especie.volumen2AFustal +
      especie.precio3AFustal * especie.volumen3AFustal) /
      sumaVolumenes;
    valorMedioFustal = Number.parseFloat(valorMedioFustal.toFixed(2));

    if (Number.isNaN(valorMedioFustal))
      valorMedioFustal = 0;

    return valorMedioFustal;
  }

  calcularValorMedioLatizal(especie: Especie): number {
    if (typeof especie.volumen1ALatizal === "string")
      parseFloat(especie.volumen1ALatizal)
    if (typeof especie.volumen2ALatizal === "string")
      parseFloat(especie.volumen2ALatizal)
    if (typeof especie.volumen3ALatizal === "string")
      parseFloat(especie.volumen3ALatizal)

    var sumaVolumenes = especie.volumen1ALatizal + especie.volumen2ALatizal + especie.volumen3ALatizal;

    let valorMedioLatizal = (especie.precio1ALatizal * especie.volumen1ALatizal +
      especie.precio2ALatizal * especie.volumen2ALatizal +
      especie.precio3ALatizal * especie.volumen3ALatizal) /
      sumaVolumenes;

    valorMedioLatizal = Number.parseFloat(valorMedioLatizal.toFixed(2));

    if (Number.isNaN(valorMedioLatizal))
      valorMedioLatizal = 0;

    return valorMedioLatizal;
  }

  calcularValorMedioMontebravo(especie: Especie) {
    if (typeof especie.volumen1AMontebravo === "string")
      parseFloat(especie.volumen1AMontebravo)
    if (typeof especie.volumen2AMontebravo === "string")
      parseFloat(especie.volumen2AMontebravo)
    if (typeof especie.volumen3AMontebravo === "string")
      parseFloat(especie.volumen3AMontebravo)

    var sumaVolumenes = especie.volumen1AMontebravo + especie.volumen2AMontebravo + especie.volumen3AMontebravo;

    let valorMedioMontebravo = (especie.precio1AMontebravo * especie.volumen1AMontebravo +
      especie.precio2AMontebravo * especie.volumen2AMontebravo +
      especie.precio3AMontebravo * especie.volumen3AMontebravo) /
      sumaVolumenes;

    valorMedioMontebravo = Number.parseFloat(valorMedioMontebravo.toFixed(2))

    if (Number.isNaN(valorMedioMontebravo))
      valorMedioMontebravo = 0;

    return valorMedioMontebravo;
  }

}
