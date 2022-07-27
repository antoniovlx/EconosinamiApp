import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviaDetallesEjecucionComponent } from './previa-detalles-ejecucion.component';

describe('PreviaDetallesEjecucionComponent', () => {
  let component: PreviaDetallesEjecucionComponent;
  let fixture: ComponentFixture<PreviaDetallesEjecucionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviaDetallesEjecucionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviaDetallesEjecucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
