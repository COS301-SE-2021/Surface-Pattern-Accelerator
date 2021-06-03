import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCreatorComponent } from './collection-creator.component';


describe('CollectionCreatorComponent', () => {
  let component: CollectionCreatorComponent;
  let fixture: ComponentFixture<CollectionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
/*
  it('should create', () => {
    expect(component).toBeTruthy();
  });*/

});
