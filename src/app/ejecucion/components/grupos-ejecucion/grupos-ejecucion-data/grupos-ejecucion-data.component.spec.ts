import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GruposEjecucionDataComponent } from './grupos-ejecucion-data.component';

describe('GruposEjecucionDataComponent', () => {
  let component: GruposEjecucionDataComponent;
  let fixture: ComponentFixture<GruposEjecucionDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposEjecucionDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GruposEjecucionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
