import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviaGraficoCostoComponent } from './previa-grafico-costo.component';

describe('PreviaGraficoCostoComponent', () => {
  let component: PreviaGraficoCostoComponent;
  let fixture: ComponentFixture<PreviaGraficoCostoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviaGraficoCostoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviaGraficoCostoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
