import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PatternComponent } from './pattern.component';

describe('PatternComponent', () => {
  let component: PatternComponent;
  let fixture: ComponentFixture<PatternComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatternComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test 1: Testing if canvas download is executed when download button is called', () => {

    spyOn(component, 'downloadCanvas');
    let btnEl1 = fixture.debugElement.nativeElement.querySelector('#download-btn');
    btnEl1.click();

    expect(component.downloadCanvas).toHaveBeenCalled();
  });

  /*
  it('should make sure canvas motif is a svg'), () => {
    let path = component.setSize(component.spacing, component.rotateNum, component.scaleNum);
    expect(path).toContain('svg');
  }


  it('should make sure the pattern preview works'), () => {
    expect(component.openModal() != null).toBe(true);
  }

  it('should expect necessary default attributes set'), () => {
    expect(component.spacing != null && component.scaleNum != null).toBe(true);
  }

   */
});
