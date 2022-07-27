import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilosofiaRecursosComponent } from './filosofia-recursos.component';

describe('FilosofiaRecursosComponent', () => {
  let component: FilosofiaRecursosComponent;
  let fixture: ComponentFixture<FilosofiaRecursosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilosofiaRecursosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilosofiaRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
