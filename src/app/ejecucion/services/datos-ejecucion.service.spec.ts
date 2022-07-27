import { TestBed } from '@angular/core/testing';

import { DatosEjecucionService } from './datos-ejecucion.service';

describe('DatosEjecucionService', () => {
  let service: DatosEjecucionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosEjecucionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
