import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PresupuestosMedioComponent } from './presupuestos-medio.component';

describe('PresupuestosMedioComponent', () => {
  let component: PresupuestosMedioComponent;
  let fixture: ComponentFixture<PresupuestosMedioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestosMedioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PresupuestosMedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
