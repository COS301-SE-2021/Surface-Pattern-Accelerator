import {Component, Input, OnInit} from '@angular/core';
import {CollectionsServiceService} from "../../services/collections-service.service";
import {ICollectionsContent} from "../../Interfaces/collectionContents.interface";
import {LoadingController, PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-collection-operation-popover',
  templateUrl: './collection-operation-popover.component.html',
  styleUrls: ['./collection-operation-popover.component.scss'],
})
export class CollectionOperationPopoverComponent implements OnInit {

  @Input() key1: ICollectionsContent;
  constructor(private loadingController: LoadingController, private collectionsService: CollectionsServiceService, private popoverController: PopoverController) {
  }

  ngOnInit() {
  }

  deleteCollection() {
    this.loadingController.create({
      message: "Deleting collection..."
    }).then(loaderResult => {
      loaderResult.present().then(r => {
        this.collectionsService.deleteCollection(this.key1).subscribe();
        setTimeout(() => {
          this.loadingController.dismiss();
        }, 1000);

        this.popoverController.dismiss("DELETED");

      })
    })
  }


}
