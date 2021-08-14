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

  it('Test1: Test to see if the import svg button calls the right function', () => {
    spyOn(component,'importSVG');
    const importBtn = fixture.debugElement.nativeElement.querySelector('#importBtn');
    importBtn.click();

    fixture.whenStable().then(()=>{
      expect(component.importSVG).toHaveBeenCalled();
    });
  });

});
