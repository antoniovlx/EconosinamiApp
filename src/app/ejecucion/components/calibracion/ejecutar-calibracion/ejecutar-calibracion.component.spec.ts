import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EjecutarCalibracionComponent } from './ejecutar-calibracion.component';

describe('EjecutarCalibracionComponent', () => {
  let component: EjecutarCalibracionComponent;
  let fixture: ComponentFixture<EjecutarCalibracionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EjecutarCalibracionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EjecutarCalibracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
