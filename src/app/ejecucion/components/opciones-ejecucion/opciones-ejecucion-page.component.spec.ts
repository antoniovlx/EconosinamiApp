import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpcionesEjecucionPageComponent } from './opciones-ejecucion-page.component';

describe('OpcionesEjecucionPageComponent', () => {
  let component: OpcionesEjecucionPageComponent;
  let fixture: ComponentFixture<OpcionesEjecucionPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcionesEjecucionPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpcionesEjecucionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
