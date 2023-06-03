import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {TextFormat} from "../models/textFormat";
import {fabric} from "fabric";
import {IBaseFilter} from "fabric/fabric-impl";
import {SubMenuType} from "../models/subMenuType";

@Injectable({
  providedIn: 'root'
})
export class TransferDataService {

  constructor() { }

  private dataSubject = new Subject<any>();

  data$ = this.dataSubject.asObservable();

  private dataSubject2 = new Subject<any>();

  data$2 = this.dataSubject2.asObservable();

  private dataSubject3 = new Subject<any>();

  data$3 = this.dataSubject3.asObservable();

  private dataSubject4 = new Subject<any>();

  data$4 = this.dataSubject4.asObservable();
  private dataSubject5 = new Subject<any>();

  data$5 = this.dataSubject5.asObservable();


  sendTab(tab:string){
    this.dataSubject5.next(tab);
  }
  sendObject(data:any){
    this.dataSubject.next(data)
  }
  sendData3(data: TextFormat) {
    console.log(data)
    this.dataSubject3.next(data);
  }
  sendData2(data: TextFormat) {
    console.log(data)
    this.dataSubject2.next(data);
  }
  sendData(data: TextFormat) {
    console.log(data)
    this.dataSubject.next(data);
  }

  sendColor(data:string){
    this.dataSubject.next(data)
  }
  sendThickenss(data:number){
    this.dataSubject.next(data)
  }

  sendSubMenuType(type:SubMenuType){
    console.log(Object.values(SubMenuType).includes(type))
    this.dataSubject.next(type)
    console.log("sa trimis....?")
  }
  sendFilter(filters: IBaseFilter[] | undefined){
    this.dataSubject4.next(filters);
 }
  sendData4(filter: fabric.IBaseFilter) {

    this.dataSubject.next(filter);
  }

  sendResetFilters(data:boolean){
    this.dataSubject.next(data)
  }


  sendAddButton(event: [boolean, TextFormat]){
    this.dataSubject.next(event);
  }

  sendDrawType(type:SubMenuType){
    this.dataSubject.next(type);
  }
}
