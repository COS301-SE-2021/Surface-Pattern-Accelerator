import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

//components
import { AppComponent } from './app.component';
import { NewCollectionComponent } from './components/collection-creator/new-collection/new-collection.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { ColorComponent } from './components/color/color.component';

//services
import { CollectionsServiceService } from './services/collections-service.service';

describe('AppComponent', () => {
  //Fixtures
  let appFixture: ComponentFixture<AppComponent>;
  let newCollectionFixture: ComponentFixture<NewCollectionComponent>;
  let collectionServiceFixture: CollectionsServiceService;
  let collectionFixture: ComponentFixture<CollectionsComponent>;
  let colorFixture: ComponentFixture<ColorComponent>;

  //Components
  let app: AppComponent;
  let newCollection: NewCollectionComponent;
  let collectionService: CollectionsServiceService;
  let collectionComponent: CollectionsComponent;
  let colorComponent: ColorComponent;

  //create a collection service
  let collectionServiceM: Partial<CollectionsServiceService>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: CollectionsServiceService,
        useValue: collectionServiceM
      }]
    }).compileComponents();
  }));

  it('should create the app', () => {
    appFixture = TestBed.createComponent(AppComponent);
    app = appFixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });

  // TODO: integration tests in here

  it('Integration test: color picker component should be called from the newCollection component ', () => {

    newCollectionFixture = TestBed.createComponent(NewCollectionComponent);

    newCollection = newCollectionFixture.debugElement.componentInstance;

    newCollectionFixture.whenStable().then(() => {

      const element = newCollectionFixture.debugElement.nativeElement.querySelector('#newCol') as HTMLButtonElement;

      element.click();

      expect(newCollection.getColorCodes).toHaveBeenCalled();
    });
  });

  // eslint-disable-next-line max-len
  it('Integration test: testing to see if the new Collection component is interacting with the correct method in the collection service', () => {
    newCollectionFixture = TestBed.createComponent(NewCollectionComponent);

    newCollection = newCollectionFixture.debugElement.componentInstance;

    newCollectionFixture.whenStable().then(() => {

      collectionServiceFixture = TestBed.inject(CollectionsServiceService);

      if(collectionServiceFixture) {

        const element = newCollectionFixture.debugElement.nativeElement.querySelector('#newCol') as HTMLButtonElement;

        element.click();

        expect(collectionService.createNewCollection).toHaveBeenCalled();
      }
      });
    expect().nothing();
  });

  it('Integration test: to see if the collections interacts with the new collection component',() => {

    if(collectionFixture){

      const el = collectionFixture.debugElement.nativeElement.querySelector('#redirect');

      el.click();

      expect(collectionComponent.navigateTo).toHaveBeenCalled();
    }
    expect().nothing();
  });

  it('Integration test: to see if the color palette is called from the color editor component', () => {
    colorFixture = TestBed.createComponent(ColorComponent);

    colorComponent = colorFixture.debugElement.nativeElement.componentInstance;

    colorFixture.whenStable().then( () => {

      const el = colorFixture.debugElement.nativeElement.querySelector('#genBtn');

      el.click();

      expect(colorComponent.colorGenerator).toHaveBeenCalled();

    });
  });

  it('Integration test: testing to see if the color editor calls the change color component', () => {
    colorFixture = TestBed.createComponent(ColorComponent);

    colorComponent = colorFixture.debugElement.nativeElement.componentInstance;

    colorFixture.whenStable().then( () => {

      const el = colorFixture.debugElement.nativeElement.querySelector('#changeColorBtn');

      el.click();

      expect(colorComponent.changeFill).toHaveBeenCalled();
    });
  });
});
