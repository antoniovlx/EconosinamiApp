import { TestBed } from '@angular/core/testing';

import { MediosService } from './medios.service';

describe('MediosService', () => {
  let service: MediosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
