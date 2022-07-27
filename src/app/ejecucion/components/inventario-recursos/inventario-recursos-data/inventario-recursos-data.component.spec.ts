import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventarioRecursosDataComponent } from './inventario-recursos-data.component';

describe('InventarioRecursosDataComponent', () => {
  let component: InventarioRecursosDataComponent;
  let fixture: ComponentFixture<InventarioRecursosDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioRecursosDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventarioRecursosDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
