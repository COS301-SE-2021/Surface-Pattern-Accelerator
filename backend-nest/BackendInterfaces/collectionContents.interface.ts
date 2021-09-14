// this interface represents the physical structure of the collections file stored on the drive
// must align with version on Angular

import {IMotifBodyInterface} from "./motifBodyInterface";

export interface ICollectionsContent {
    collectionName: string;
    collectionID: string;
    motifsFolderID: string;
    patternsFolderID: string;
    collectionThumbnail: string;
    childPatterns: [{patternName: string, patternID: string}];
    childMotifs: IMotifBodyInterface[];
    story: string;
    colorThemes: [{hex: string}];
}
