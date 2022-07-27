import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FuegosIntensidadComponent } from './fuegos-intensidad.component';

describe('FuegosIntensidadComponent', () => {
  let component: FuegosIntensidadComponent;
  let fixture: ComponentFixture<FuegosIntensidadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FuegosIntensidadComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FuegosIntensidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
