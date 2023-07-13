import {Component} from '@angular/core';
import {TextFormat} from "../../models/textFormat";
import {TransferDataService} from "../../services/transfer-data.service";
import {SubMenuType} from "../../models/subMenuType";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent {
  selectedIcon: any = null;
  public selectedColor: string;
  txtFormat: TextFormat;
  textFormat: TextFormat;
  addButton = false;

  constructor(private dataService: TransferDataService) {
    document.body.style.overflow = 'hidden';

    this.dataService.data$2.subscribe((data) => {
      switch (true) {
        case (typeof data === 'boolean'):
          break;
        case (data instanceof TextFormat):
          this.dataService.sendData3(data)
          break;
        default:
          break;
      }

    });

  }

  public setSelectedColor(color: string): void {
    this.dataService.sendColor(color)
  }

  public setThicknessColor(thickness: number) {
    this.dataService.sendThickenss(thickness)
  }

  sendData(data: TextFormat) {
    this.dataService.sendData(data);
  }

  setButtonDraw(type: SubMenuType) {
    this.dataService.sendSubMenuType(type)

  }

  setTextFormat(value: TextFormat) {
    this.textFormat = value;
    this.sendData(this.textFormat)
  }

  setButtonAdd(event: [boolean, TextFormat]) {

    this.dataService.sendAddButton(event)
  }


  selectIcon(icon: any): void {
    this.selectedIcon = icon;
    this.dataService.sendSubMenuType(icon)

  }
  isFileSelected=false

  receiveData($event: boolean) {
    this.isFileSelected=$event
    console.log($event)

  }
}
