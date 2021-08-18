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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test 1: should have newCollection function', () => {
    spyOn(component, 'newCollection');
    const btn = fixture.debugElement.nativeElement.querySelector('.add-button');
    btn.click();

    fixture.whenStable().then(()=>{
      //expect(component.newCollection).toHaveBeenCalled();//FIX THIS
    });
  });



});
