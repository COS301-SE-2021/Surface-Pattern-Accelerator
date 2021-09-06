import {fabric} from "fabric"
export class Memento
{
  private _state : fabric.Object[];

  constructor(state : fabric.Object[])
  {
    this._state = [];
    for(let i = 0 ; i < state.length ; i++){
      this._state[i] = state[i];
    }
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
