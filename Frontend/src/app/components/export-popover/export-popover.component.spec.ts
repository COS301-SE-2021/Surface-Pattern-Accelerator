import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExportPopoverComponent } from './export-popover.component';

describe('ExportPopoverComponent', () => {
  let component: ExportPopoverComponent;
  let fixture: ComponentFixture<ExportPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  //
  // it('Test 1: Testing if correct method is called when ok button is clicked', () => {
  //   spyOn(component, 'closePopover');
  //   let btn1 = fixture.debugElement.nativeElement.querySelector('#ok-btn');
  //   btn1.click();
  //
  //   fixture.whenStable().then(() => {
  //     expect(component.closePopover).toHaveBeenCalled();
  //   });
  // });
});
