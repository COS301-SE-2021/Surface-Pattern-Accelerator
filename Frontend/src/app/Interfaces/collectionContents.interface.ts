// this interface represents the physical structure of the collections file stored on the drive
//Must align with version on Node

import {motifBodyInterface} from "./motifBodyInterface";

export interface ICollectionsContent {
  collectionName: string;
  collectionID: string;
  motifsFolderID: string;
  patternsFolderID: string;
  childPatterns: [{patternName: string, patternID: string}];
  childMotifs: motifBodyInterface[];
  story: string;
  colorThemes: [{hex: string}];
}
