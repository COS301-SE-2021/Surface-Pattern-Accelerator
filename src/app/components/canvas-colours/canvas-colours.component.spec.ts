import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CanvasColoursComponent } from './canvas-colours.component';

describe('CanvasColoursComponent', () => {
  let component: CanvasColoursComponent;
  let fixture: ComponentFixture<CanvasColoursComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasColoursComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasColoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test 1: Testing if correct method is called when the user clicks on the canvas',()=>{
    spyOn(component, "canvasColour");
    let canvasElement = fixture.debugElement.nativeElement.querySelector('#canvas');
    canvasElement.click();

    fixture.whenStable().then(()=>{
      expect(component.canvasColour).toHaveBeenCalled();
    })
  });
  it('Test 2: checking if canvas colour function call works correctly', ()=>{
    let result = component.canvasColour();
    expect(result).toEqual(1);
  });

  it('Test 3: Testing if rgb to hex converter works correctly', ()=>{
    let result = component.rgbToHex('rgb(219,24,163)');
    expect(result).toEqual('#DB18A3');
  });


});
