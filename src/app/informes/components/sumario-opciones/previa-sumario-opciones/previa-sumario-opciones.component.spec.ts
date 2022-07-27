import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviaSumarioOpcionesComponent } from './previa-sumario-opciones.component';

describe('PreviaSumarioOpcionesComponent', () => {
  let component: PreviaSumarioOpcionesComponent;
  let fixture: ComponentFixture<PreviaSumarioOpcionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviaSumarioOpcionesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviaSumarioOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
