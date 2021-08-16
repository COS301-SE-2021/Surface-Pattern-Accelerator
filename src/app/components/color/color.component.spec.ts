import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColorComponent } from './color.component';

describe('ColorComponent', () => {
  let component: ColorComponent;
  let fixture: ComponentFixture<ColorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test2: Test to see if the change text button works correctly when clicked ', () => {
    spyOn(component, 'changeFillText');
    const changeBtn = fixture.debugElement.nativeElement.querySelector('#changeTextBtn');
    changeBtn.click();

    fixture.whenStable().then(()=>{
      expect(component.changeFillText).toHaveBeenCalled();
    });
  });

  it('Test3: Test to see if the save button works correctly with the right function call', () => {
    spyOn(component, 'saveSvg');
    const changeBtn = fixture.debugElement.nativeElement.querySelector('#saveBtn');
    changeBtn.click();

    fixture.whenStable().then(()=>{
      expect(component.saveSvg).toHaveBeenCalled();
    });
  });

});
