import { TestBed } from '@angular/core/testing';

import { ComportamientoService } from './comportamiento.service';

describe('ComportamientoService', () => {
  let service: ComportamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComportamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
