import {Component, Input, OnInit} from '@angular/core';
import {CollectionsServiceService} from "../../services/collections-service.service";
import {ICollectionsContent} from "../../Interfaces/collectionContents.interface";

@Component({
  selector: 'app-collection-operation-popover',
  templateUrl: './collection-operation-popover.component.html',
  styleUrls: ['./collection-operation-popover.component.scss'],
})
export class CollectionOperationPopoverComponent implements OnInit {

  @Input() key1: ICollectionsContent;
  constructor(private collectionsService: CollectionsServiceService) { }

  ngOnInit() {}

  deleteCollection(){
    //console.log("Want to delete :");
    //console.log(this.key1);
    this.collectionsService.deleteCollection(this.key1).subscribe(res=>{
      console.log(res);
    });
  }

}
