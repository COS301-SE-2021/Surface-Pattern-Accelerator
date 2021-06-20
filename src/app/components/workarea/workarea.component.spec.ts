import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkareaComponent } from './workarea.component';

describe('WorkareaComponent', () => {
  let component: WorkareaComponent;
  let fixture: ComponentFixture<WorkareaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkareaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test 1: Testing if correct method is called when rectangle button is clicked', () => {
    spyOn(component, 'chooseCanvasSymbol');
    const btnElement = fixture.debugElement.nativeElement.querySelector('#rect');
    btnElement.click();

    fixture.whenStable().then(() => {
      expect(component.chooseCanvasSymbol).toHaveBeenCalled();
    });
  });
  it('Test 2: Testing if correct method is called when square button is clicked', () => {
    spyOn(component, 'chooseCanvasSymbol');
    const btnElement = fixture.debugElement.nativeElement.querySelector('#rect');
    btnElement.click();

    fixture.whenStable().then(() => {
      expect(component.chooseCanvasSymbol).toHaveBeenCalled();
    });
  });
});
