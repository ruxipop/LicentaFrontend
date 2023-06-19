import {Component, EventEmitter, Output} from '@angular/core';
import {TextFormat} from "../models/textFormat";
import {Subject} from "rxjs";
import {TransferDataService} from "../service/transfer-data.service";
import {SubMenuType} from "../models/subMenuType";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent {
  selectedIcon: any = null; // Iconul selectat
  public selectedColor: string;

  public setSelectedColor(color: string): void {
    this.dataService.sendColor(color)
  }

  public setThicknessColor(thickness: number) {
    this.dataService.sendThickenss(thickness)
  }

  txtFormat: TextFormat;

  constructor(private dataService: TransferDataService) {
    this.dataService.data$2.subscribe((data) => {
      switch (true) {
        case (typeof data === 'boolean'):
          // this.onCli();
          break;
        case (data instanceof TextFormat):
          this.dataService.sendData3(data)
          break;
        default:
          // Alte cazuri
          break;
      }

    });

  }


  sendData(data: TextFormat) {
    this.dataService.sendData(data);
  }

  setButtonDraw(type: SubMenuType) {
    this.dataService.sendSubMenuType(type)

  }

  textFormat: TextFormat;

  setTextFormat(value: TextFormat) {
    this.textFormat = value;
    console.log("nebUUU" + this.textFormat)
    this.sendData(this.textFormat)
  }

  addButton = false;

  setButtonAdd(event: [boolean, TextFormat]) {

    this.dataService.sendAddButton(event)
  }


  selectIcon(icon: any): void {

    // if (this.selectedIcon === icon) {
    //   console.log("acum")//aici era inainte
    //   this.selectedIcon = null;
    // } else {
    //   this.selectedIcon = icon;
    // }
    this.selectedIcon = icon;
    console.log("icon " + icon)
    // this.dataService.sendResetFilters(true)
    this.dataService.sendSubMenuType(icon)

  }

}
