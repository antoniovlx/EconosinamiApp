import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosGeneralesMedioComponent } from './datos-generales-medio.component';

describe('DatosGeneralesMedioComponent', () => {
  let component: DatosGeneralesMedioComponent;
  let fixture: ComponentFixture<DatosGeneralesMedioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesMedioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesMedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
