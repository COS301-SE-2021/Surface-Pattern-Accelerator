import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CollectionCreatorComponent } from './collection-creator.component';

describe('CollectionCreatorComponent', () => {
let component: CollectionCreatorComponent;
let fixture: ComponentFixture<CollectionCreatorComponent>;

beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({
    declarations: [ CollectionCreatorComponent ],
    imports: [IonicModule.forRoot()]
  }).compileComponents();

  fixture = TestBed.createComponent(CollectionCreatorComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
}));

/*
it('should create', () => {
  expect(component).toBeTruthy();
});
 */
});
