import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BasesRepository } from 'src/app/repositories/BasesRepository';
import { CphlrRepository } from 'src/app/repositories/CphlrRepository';
import { CphRepository } from 'src/app/repositories/CphRepository';
import { DcflrRepository } from 'src/app/repositories/DcflrRepository';
import { DcfRepository } from 'src/app/repositories/DcfRepository';
import { DistanciasRepository } from 'src/app/repositories/DistanciasRepository';
import { GdcfRepository } from 'src/app/repositories/GdcfRepository';
import { LrRepository } from 'src/app/repositories/LrRepository';
import { ZamifRepository } from 'src/app/repositories/ZamifRepository';
import { AppService, ContainerItem } from 'src/app/services/app.service';
import { OrmService } from 'src/app/services/orm.service';
import { DynamicDirective } from 'src/app/shared/directives/dynamic.directive';
import { Bases } from 'src/entities/Bases';
import { Cph } from 'src/entities/Cph';
import { Cphlr } from 'src/entities/Cphlr';
import { Dcf } from 'src/entities/Dcf';
import { Dcflr } from 'src/entities/Dcflr';
import { Distancias } from 'src/entities/Distancias';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Lr } from 'src/entities/Lr';
import { ModelosCombustible } from 'src/entities/ModelosCombustible';
import { Zamif } from 'src/entities/Zamif';

@Injectable({ providedIn: "root" })
export class ZonasService {
  private zamifListLoaded$ = new Subject<Zamif[]>();

  private zonasAnalisisCompleted$ = new Subject<boolean>();
  private comportamientoFuegoCompleted$ = new Subject<boolean>();
  private costesCompleted$ = new Subject<boolean>();

  constructor(private ormservice: OrmService,
    private zamifRepository: ZamifRepository,
    private lrRepository: LrRepository,
    private distanciasRepository: DistanciasRepository,
    private basesRepository: BasesRepository,
    private cphRepository: CphRepository,
    private cphlrRepository: CphlrRepository,
    private gdcfRepository: GdcfRepository,
    private dcfRepository: DcfRepository,
    private dcflrRepository: DcflrRepository) { }


  getZonasAnalisisCompleted$() {
    return this.zonasAnalisisCompleted$.asObservable();
  }

  getComportamientoFuegoCompleted$() {
    return this.comportamientoFuegoCompleted$.asObservable();
  }

  getCostesCompleted$() {
    return this.costesCompleted$.asObservable();
  }

  setZonasAnalisisCompleted$(completed: boolean) {
    return this.zonasAnalisisCompleted$.next(completed);
  }
  
  setComportamientoFuegoCompleted$(completed: boolean) {
    return this.comportamientoFuegoCompleted$.next(completed);
  }

  setCostesCompleted$(completed: boolean) {
    return this.costesCompleted$.next(completed);
  }


  getModelosCombustibles(): Observable<ModelosCombustible[]> {
    return new Observable(subscriber => {
      let repo = this.ormservice.getDBConnection().getRepository(ModelosCombustible);
      repo.find().then(modelos => subscriber.next(modelos));
    })
  }

  getLugaresRepresentativosByZamif(idZamif: number): Observable<Lr[]> {
    return this.lrRepository.getByZamif(idZamif);
  }

  getLugaresRepresentativosByCnvr(idGrupoCnvr: number) {
    return this.lrRepository.getLrByCnvr(idGrupoCnvr);
  }

  getAllZamif() {
    return this.zamifRepository.getAllZamif();
  }

  // ZAMIF
  getZamifLoaded$() {
    return this.zamifListLoaded$.asObservable();
  }

  getZamifList() {
    this.zamifRepository.getAllZamif().subscribe(zamifList => {
      this.zamifListLoaded$.next(zamifList);
    });
  }

  getZamifById(idZamif: number) {
    return this.zamifRepository.getZamifById(idZamif);
  }


  saveOrUpdateZamif(zamif: Zamif) {
    return this.zamifRepository.saveOrUpdateZamif(zamif)
  }

  saveOrUpdateLr(lr: Lr) {
    return this.lrRepository.saveOrUpdateLr(lr);
  }

  deleteZamif(zamif: Zamif) {
    return this.zamifRepository.deleteZamif(zamif);
  }

  deleteLr(lr: Lr) {
    return this.lrRepository.deleteLr(lr);
  }

  deleteLrByZamif(idZamif: number) {
    return this.lrRepository.deleteLrByZamif(idZamif);
  }

  getDistanciasByLr(idLr: number) {
    return this.distanciasRepository.getDistanciasByLr(idLr);
  }
  

  deleteDistanciasByLr(idLr: number) {
    return this.distanciasRepository.deleteDistanciasByLr(idLr);
  }

  saveOrUpdateDistancias(distancias: Distancias) {
    return this.distanciasRepository.saveDistancias(distancias.idLr.idLr, distancias.idBase.idBase, distancias.kilometros);
  }

  getBasesList(): Observable<Bases[]> {
    return this.basesRepository.getAllBases();
  }

  // Gdcf - Grupos de comportamiento fuego

  getGdcfList() {
    return this.gdcfRepository.getGdcfList();
  }

  saveOrUpdateGdcf(gdcf: GruposDcf) {
    return this.gdcfRepository.saveGdcf(gdcf);
  }

  deleteGdcf(gdcf: GruposDcf) {
    return this.gdcfRepository.deleteGdcf(gdcf);
  }

  getDcfByGfcdAndZamif(IdGDCF: number, idZamif: number) {
    return this.dcfRepository.getDcfByGdcfAndZamif(IdGDCF, idZamif);
  }

  getCphsLrAndHectareas(idLR: number, hectareas: number) {
    return this.cphlrRepository.getCphlrByLrAndHectareas(idLR, hectareas);
  }

  // DCF

  getDcfByGfcd(idGdcf: number) {
    return this.dcfRepository.getDcfByGdcf(idGdcf);
  }

  saveOrUpdatDcf(dcf: Dcf) {
    return this.dcfRepository.saveDcf(dcf);
  }

  deleteDcf(dcf: Dcf) {
    return this.dcfRepository.deleteDcf(dcf);
  }

  // DCFLR
  getDcflrsByGfcdAndLr(idGdcf: number, idLr: number) {
    return this.dcflrRepository.getDcflrsByGfcdAndLr(idGdcf, idLr);
  }

  saveOrUpdatDcflr(dcf: Dcflr) {
    return this.dcflrRepository.saveDcflr(dcf);
  }

  deleteDcflr(dcf: Dcflr) {
    return this.dcflrRepository.deleteDcflr(dcf);
  }

  deleteDcflrByLr(idLr: any) {
    return this.dcflrRepository.deleteDcflrByLr(idLr);
  }

  deleteDcfByZamif(idZamif: number) {
    return this.dcfRepository.deleteDcfByZamif(idZamif);
  }


  // Cph - Costes ZAMIF

  getCphsByZamif(idZamif: number): Observable<Cph[]> {
    return this.cphRepository.getCphByZamif(idZamif);
  }

  saveOrUpdateCph(cph: Cph) {
    return this.cphRepository.saveCph(cph)
  }

  deleteCphByZamif(idZamif: number) {
    return this.cphRepository.deleteCphByZamif(idZamif);
  }

  // Cphlr - Costes LR

  getCphlrByLr(idLr: number): Observable<Cphlr[]> {
    return this.cphlrRepository.getCphlrByLr(idLr);
  }

  saveOrUpdateCphlr(cphlr: Cphlr) {
    return this.cphlrRepository.saveCphlr(cphlr)
  }



}
