import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPatternComponent } from './new-pattern.component';

describe('NewPatternComponent', () => {
  let component: NewPatternComponent;
  let fixture: ComponentFixture<NewPatternComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPatternComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing function call for savePattern', () => {
    expect(component.saveNewPattern).toBeTruthy();
  });

  it('Testing function call for closePopup', () => {
    expect(component.closePopup).toBeTruthy();
  });
});
