import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComportamientoFuegoComponent } from './comportamiento-fuego.component';

describe('ComportamientoFuegoComponent', () => {
  let component: ComportamientoFuegoComponent;
  let fixture: ComponentFixture<ComportamientoFuegoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComportamientoFuegoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComportamientoFuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
