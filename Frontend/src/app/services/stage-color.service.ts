import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StageColorService {

  private stageSource = new Subject<any>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  stage$ = this.stageSource.asObservable();

  constructor() { }

  sendStage(st: any){
    this.stageSource.next(st);
  }
}
