import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TamanosCalculadosComponent } from './tamanos-calculados.component';

describe('TamanosCalculadosComponent', () => {
  let component: TamanosCalculadosComponent;
  let fixture: ComponentFixture<TamanosCalculadosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TamanosCalculadosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TamanosCalculadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
