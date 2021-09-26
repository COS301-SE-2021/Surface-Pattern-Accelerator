import {fabric} from "fabric"
import {Memento} from "./Memento";
import {IPatternContentsInterface} from "../../Interfaces/patternContents.interface";
export class Originator
{
  _state : IPatternContentsInterface;

  constructor()
  {
    this._state = { patternName: "", patternID: "", motifs: [] };
  }

  setState(state: IPatternContentsInterface){
    this._state = { patternName: "", patternID: "", motifs: [] };
   // for(let i = 0 ; i < state.length ; i++){
   //
   //   this._state[i] = state[i];
   // }

    this._state = state;
  }

  saveStateToMemento(){
    return new Memento(this._state);
  }

  restoreStateFromMemento(memento : Memento){
    this._state  = { patternName: "", patternID: "", motifs: [] };
   let state : IPatternContentsInterface = memento.getSavedState();
    // for(let i = 0 ; i < state.length ; i++){
    //    this._state[i] = state[i];
    // }
    this._state = state;
    return this._state;
}

  // getState(){ // by value or by reference?
  //   let state : fabric.Object[];
  //   for(let i = 0 ; i < state.length ; i++){
  //     state[i] = this._state[i];
  //   }
  //   return this._state;
  // }
  //

  //


}
