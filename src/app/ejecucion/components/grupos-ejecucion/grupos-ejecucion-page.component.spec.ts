import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GruposEjecucionPageComponent } from './grupos-ejecucion-page.component';

describe('GruposEjecucionPageComponent', () => {
  let component: GruposEjecucionPageComponent;
  let fixture: ComponentFixture<GruposEjecucionPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposEjecucionPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GruposEjecucionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
