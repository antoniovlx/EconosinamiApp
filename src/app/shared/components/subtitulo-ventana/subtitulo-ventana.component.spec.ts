import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubtituloVentanaComponent } from './subtitulo-ventana.component';

describe('SubtituloVentanaComponent', () => {
  let component: SubtituloVentanaComponent;
  let fixture: ComponentFixture<SubtituloVentanaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtituloVentanaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubtituloVentanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
