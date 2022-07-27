import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventarioRecursosPageComponent } from './inventario-recursos-page.component';

describe('InventarioRecursosPageComponent', () => {
  let component: InventarioRecursosPageComponent;
  let fixture: ComponentFixture<InventarioRecursosPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioRecursosPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventarioRecursosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
