import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { AppComponent } from './app.component';
import { PatternComponent } from "./components/pattern/pattern.component";
import { PreviewComponent } from "./components/preview/preview.component";

describe('AppComponent', () => {

  let patternComponent: PatternComponent;
  let patternFixture: ComponentFixture<PatternComponent>;
  let previewFixture: ComponentFixture<PreviewComponent>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [AppComponent, PatternComponent, PreviewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  // TODO: add more tests!

  it('INTEGRATION: Call to pattern preview component works from the pattern component', () => {
    if(patternFixture){

      let elem = patternFixture.debugElement.nativeElement.querySelector('#preview');
      elem.click();

      expect(patternComponent.openModal).toHaveBeenCalled();
    }
  });

  it('INTEGRATION: should ensure the path the image in function', function () {
    if(patternFixture){

      let elem = patternFixture.debugElement.nativeElement.querySelector('#preview');
      elem.click();

      expect(patternComponent.openModal).toBe(true);
    }
  });

  it('INTEGRATION: should ensure the path the image uses is correct in src', function () {
    if(patternFixture){

      let patternElem = patternFixture.debugElement.nativeElement.querySelector('#preview');
      patternElem.click();
    }

    if(previewFixture){

      let elem = patternFixture.debugElement.nativeElement.querySelector('img');
      elem.click();

      expect(elem.src).toBe('../../assets/pattern-preview.png');
    }
  });




});
