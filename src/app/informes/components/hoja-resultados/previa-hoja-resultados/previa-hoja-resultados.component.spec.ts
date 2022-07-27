import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviaHojaResultadosComponent } from './previa-hoja-resultados.component';

describe('PreviaHojaResultadosComponent', () => {
  let component: PreviaHojaResultadosComponent;
  let fixture: ComponentFixture<PreviaHojaResultadosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviaHojaResultadosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviaHojaResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
