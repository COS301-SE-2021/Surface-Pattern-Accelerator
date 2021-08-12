// this interface represents the physical structure of the collections file stored on the drive

export interface ICollectionsContent {
    collectionName: string;
    collectionID: string;
    motifsFolderID: string;
    patternsFolderID: string;
    childPatterns: [{patternName: string, patternID: string}];
    story: string;
    colorThemes: [{hex: string}];
}
