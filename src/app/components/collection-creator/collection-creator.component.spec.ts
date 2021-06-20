import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CollectionCreatorComponent } from './collection-creator.component';
import { CollectionsServiceService } from '../../services/collections-service.service';

describe('CollectionCreatorComponent', () => {
let component: CollectionCreatorComponent;
let fixture: ComponentFixture<CollectionCreatorComponent>;

beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({
    declarations: [ CollectionCreatorComponent],
    providers: [CollectionsServiceService, CollectionCreatorComponent],
    imports: [IonicModule.forRoot(),  HttpClientTestingModule]
  }).compileComponents();

  fixture = TestBed.createComponent(CollectionCreatorComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
}));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CollectionCreatorComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have newCollection function', () => {
    const fixture = TestBed.inject(CollectionCreatorComponent);
    expect(fixture.newCollection).toBeTruthy();
  });



});
