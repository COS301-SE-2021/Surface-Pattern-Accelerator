import {fabric} from "fabric"
import {Memento} from "./Memento";
export class Originator
{
  _state : fabric.Object[];

  constructor()
  {
    this._state = [];
  }

  setState(state: fabric.Object[]){
   for(let i = 0 ; i < state.length ; i++){
     this._state[i] = state[i];
   }
  }

  saveStateToMemento(){
    return new Memento(this._state);
  }

  restoreStateFromMemento(memento : Memento){
   let state : fabric.Object[] = memento.getSavedState();
    for(let i = 0 ; i < state.length ; i++){
       this._state[i] = state[i];
    }
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
