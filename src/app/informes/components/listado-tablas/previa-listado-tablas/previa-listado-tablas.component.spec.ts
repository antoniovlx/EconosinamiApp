import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviaListadoTablasComponent } from './previa-listado-tablas.component';

describe('PreviaListadoTablasComponent', () => {
  let component: PreviaListadoTablasComponent;
  let fixture: ComponentFixture<PreviaListadoTablasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviaListadoTablasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviaListadoTablasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
