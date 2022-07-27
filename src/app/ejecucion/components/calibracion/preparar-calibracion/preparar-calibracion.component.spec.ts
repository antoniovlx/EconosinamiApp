import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrepararCalibracionComponent } from './preparar-calibracion.component';

describe('PrepararCalibracionComponent', () => {
  let component: PrepararCalibracionComponent;
  let fixture: ComponentFixture<PrepararCalibracionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepararCalibracionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrepararCalibracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
