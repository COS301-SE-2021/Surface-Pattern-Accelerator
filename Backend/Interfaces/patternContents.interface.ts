// this interface represents the physical structure of a pattern file stored on the drive
//must align with version on Angular

export interface IPatternContentsInterface {
    patternName: string;
    motifs: [{motifName: string, motifID: string}];
}