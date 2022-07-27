import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CambioNetoValorPageComponent } from './cambio-neto-valor-page.component';

describe('CambioNetoValorPageComponent', () => {
  let component: CambioNetoValorPageComponent;
  let fixture: ComponentFixture<CambioNetoValorPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioNetoValorPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CambioNetoValorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
