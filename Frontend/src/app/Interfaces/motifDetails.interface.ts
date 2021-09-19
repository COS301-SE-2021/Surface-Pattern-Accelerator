
export interface IMotifStateInterface {
    left: number;
    top: number;
    width: number;
    height: number;
    scale: any;
    rotation: number;
    layer: number;
    motifID: string;
    motifName: string;
    motifURL: string;

    //modifiers
      //Seamless mod
    shouldDisplaySeamless: Boolean;

      //Array mod
    nrOfArrayObjects: number;
    ArrayModDirection: number;
    ArrayModSpacing: number;

  }

