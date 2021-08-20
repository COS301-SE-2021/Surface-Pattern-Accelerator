// this interface represents the physical structure of a pattern file stored on the drive
//must align with version on Angular

import {IMotifDetailsInterface} from "./motifDetails.interface"

export interface IPatternContentsInterface {
    patternName: string;
    patternID: string;
    motifs: IMotifDetailsInterface[]; //name of motif needs to be added as well
}