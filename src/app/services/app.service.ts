import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { User } from 'src/entities/user';
import { BehaviorSubject, Subject } from 'rxjs';
import { DynamicDirective } from '../shared/directives/dynamic.directive';
import { Platform } from '@ionic/angular';
import { Configuracion } from 'src/entities/Configuracion';
import { ConfiguracionRepository } from '../repositories/ConfiguracionRepository';

export class ContainerItem {
  constructor(public component: Type<any>, public data: any) { }
}

export interface IDataContainer {
  data: any;
}


@Injectable({
  providedIn: 'root'
})
export class AppService {
  private refCurrentDynamicContainer: DynamicDirective;

  private disableTab$ = new Subject<boolean>();

  private usersLoaded$ = new Subject<User[]>();
  private historyComponents: ContainerItem[] = [];
  private dataComponentChanged$ = new Subject<any>();
  private actionButtonsChanged$ = new Subject<any>();
  private avisoChanged$ = new Subject<string>();

  constructor(private location: Location, private platform: Platform, private configuracionRepository: ConfiguracionRepository) { }

  setDisableTab$(disabled: boolean) {
    this.disableTab$.next(disabled);
  }

  setRefCurrentDynamicComponent(dynamicComponent: DynamicDirective) {
    this.refCurrentDynamicContainer = dynamicComponent;
  }

  clearRefCurrentDynamicContainer(){
    this.refCurrentDynamicContainer.viewContainerRef.clear();
  }

  getRefCurrentDynamicComponent(){
    return this.refCurrentDynamicContainer;
  }

  getDisableTab$() {
    return this.disableTab$.asObservable();
  }

  getUsersLoaded$() {
    return this.usersLoaded$.asObservable();
  }

  getActionButtonsChanged$(){
    return this.actionButtonsChanged$.asObservable();
  }

  setActionButtonsChanged$(buttons){
    return this.actionButtonsChanged$.next(buttons);
  }

  getAvisoChanged$(){
    return this.avisoChanged$.asObservable();
  }

  setAvisoChanged$(buttons){
    return this.avisoChanged$.next(buttons);
  }

  goPrev(data?: any) {
    this.deleteItemHistory();
    const history = this.getHistoryComponents();
    let previtem = history[history.length - 1];

    if(previtem === undefined){
      this.location.back();
    }else{
      if (data !== undefined) {

        if(data.back === undefined){
          data.back = false;
        }
        
        let prevData = previtem.data;
        prevData = Object.assign(prevData, data);
        previtem.data = prevData;
      }
      
      this.loadComponent(previtem, this.getRefCurrentDynamicComponent());
    }
  }

  deleteItemHistory() {
    this.historyComponents.splice(this.historyComponents.length - 1, 1)
  }

  getHistoryComponents() {
    return this.historyComponents;
  }

  clearHistoryComponents(){
    this.historyComponents = [];
  }

  loadComponent(item: ContainerItem, dynamicComponent: DynamicDirective) {
    const viewContainerRef = dynamicComponent.viewContainerRef;
    viewContainerRef.clear();

    this.addItemHistory(item);

    this.checkDisableTabs();

    this.dataComponentChanged$.next(item.data);

    const componentRef = viewContainerRef.createComponent<IDataContainer>(item.component);
    componentRef.instance.data = item.data;

  }

  addItemHistory(item: ContainerItem) {
    const itemToFindIndex = this.historyComponents.findIndex(component => component.data.titleComponent === item.data.titleComponent)
    if (itemToFindIndex === -1) {
      this.historyComponents.push(item)
    }
  }


  getTitleComponentChanged$() {
    return this.dataComponentChanged$.asObservable();
  }

  setTitleComponentChanged$(data: any) {
    this.dataComponentChanged$.next(data);
  }



  checkDisableTabs() {
    if (this.historyComponents.length !== 1) {
      this.setDisableTab$(true);
    } else {
      this.setDisableTab$(false);
    }
  }

  public isMobile() {
    return this.platform.is('mobile')
    //return true;  
  }
}
