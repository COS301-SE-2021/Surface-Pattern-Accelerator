import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CollectionBasicOperationsComponent } from './collection-basic-operations.component';

describe('CollectionBasicOperationsComponent', () => {
  let component: CollectionBasicOperationsComponent;
  let fixture: ComponentFixture<CollectionBasicOperationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionBasicOperationsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionBasicOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
