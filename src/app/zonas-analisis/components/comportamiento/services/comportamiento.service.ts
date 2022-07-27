import { Injectable } from '@angular/core';
import { BasesRepository } from 'src/app/repositories/BasesRepository';
import { OrmService } from 'src/app/services/orm.service';
import { DynamicDirective } from 'src/app/shared/directives/dynamic.directive';

@Injectable()
export class ComportamientoService {
  refDynamicContainer: DynamicDirective;
 
  constructor(private ormservice: OrmService, private basesRepository: BasesRepository) { }

  setDynamicComponent(dynamicComponent: DynamicDirective) {
    this.refDynamicContainer = dynamicComponent;
  }

  getRefDynamicComponent(){
    return this.refDynamicContainer;
  }
}
