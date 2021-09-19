import {fabric} from "fabric"
import {Memento} from "./Memento";

export class Caretaker {
  private _stateArr: Memento[];

  constructor() {
    this._stateArr = [];
  }

  addMemento(state: Memento) {
    this._stateArr.unshift(state);
    if(this._stateArr.length > 20)
      this._stateArr.pop();
    console.log(this._stateArr);
  }

  // getMemento(index : number){ // pop?
  //   return this._stateArr[index];
  // }
  notEmpty() {
    if (this._stateArr.length == 0) return false;
    else return true;
  }

  emptyStates() {
    this._stateArr = [];
  }

  getMemento() { // pop?
    if (this._stateArr.length != 0) {
      return this._stateArr.shift();
    } else return;

  }

}
