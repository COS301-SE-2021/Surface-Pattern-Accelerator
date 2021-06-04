import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGeditorComponent } from './svgeditor.component';

describe('SVGeditorComponent', () => {
  let component: SVGeditorComponent;
  let fixture: ComponentFixture<SVGeditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SVGeditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SVGeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
