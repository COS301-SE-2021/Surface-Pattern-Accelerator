import {async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from 'protractor';

import { CollorPalletComponent } from './collor-pallet.component';

describe('CollorPalletComponent tests', () => {
  let component: CollorPalletComponent;
  let fixture: ComponentFixture<CollorPalletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollorPalletComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CollorPalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test 1: Testing if correct method is called when generate button is clicked', () => {
    spyOn(component, 'colorGen');
    let btnElement = fixture.debugElement.nativeElement.querySelector('#gen-btn');
    btnElement.click();

    fixture.whenStable().then(() => {
      expect(component.colorGen).toHaveBeenCalled();
    })
  });

  it('Test 2: Testing if the lock1 button calls the lock colour method', () => {

    spyOn(component, 'lockColour');
    let btnElement = fixture.debugElement.nativeElement.querySelector('#lock1');
    btnElement.click();

    expect(component.lockColour).toHaveBeenCalled();
  });

  it('Test 3: Testing if the lock2 button calls the lock colour method', () => {

    spyOn(component, 'lockColour');
    let btnElement = fixture.debugElement.nativeElement.querySelector('#lock2');
    btnElement.click();

      expect(component.lockColour).toHaveBeenCalled();
  });

  it('Test 4: Testing if the lock3 button calls the lock colour method', () => {

    spyOn(component, 'lockColour');
    let btnElement = fixture.debugElement.nativeElement.querySelector('#lock3');
    btnElement.click();

    expect(component.lockColour).toHaveBeenCalled();
  });

  it('Test 5: Testing if the lock4 button calls the lock colour method', () => {

    spyOn(component, 'lockColour');
    let btnElement = fixture.debugElement.nativeElement.querySelector('#lock4');
    btnElement.click();

    expect(component.lockColour).toHaveBeenCalled();
  });

  it('Test 6: Testing if the lock5 button calls the lock colour method', () => {

    spyOn(component, 'lockColour');
    let btnElement = fixture.debugElement.nativeElement.querySelector('#lock5');
    btnElement.click();

    expect(component.lockColour).toHaveBeenCalled();
  });

  it('Test 7: Testing if the lock6 button calls the lock colour method', () => {

    spyOn(component, 'lockColour');
    let btnElement = fixture.debugElement.nativeElement.querySelector('#lock6');
    btnElement.click();

    expect(component.lockColour).toHaveBeenCalled();
  });
});
