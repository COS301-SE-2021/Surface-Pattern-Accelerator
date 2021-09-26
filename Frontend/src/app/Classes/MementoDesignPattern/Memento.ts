import {fabric} from "fabric"
import {IPatternContentsInterface} from "../../Interfaces/patternContents.interface";
export class Memento
{
  private _state : IPatternContentsInterface;
  private canvasStateJSON: IPatternContentsInterface;
  constructor(state : IPatternContentsInterface)
  {
   // this._state = { patternName: "", patternID: "", motifs: [] };
    this._state = state;
    // for(let i = 0 ; i < state.length ; i++){
    //   this._state[i] = state[i];
    // }
  }

  getSavedState(){ // reference or value?
    return this._state;
  }

  // setState(state : fabric.Object[]){
  //   for(let i = 0 ; i < state.length ; i++) {
  //     this._state[i] = state[i];
  //   }
  // }

}
