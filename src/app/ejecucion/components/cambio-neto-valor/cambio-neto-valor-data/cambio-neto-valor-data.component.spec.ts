import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CambioNetoValorDataComponent } from './cambio-neto-valor-data.component';

describe('CambioNetoValorDataComponent', () => {
  let component: CambioNetoValorDataComponent;
  let fixture: ComponentFixture<CambioNetoValorDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioNetoValorDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CambioNetoValorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
