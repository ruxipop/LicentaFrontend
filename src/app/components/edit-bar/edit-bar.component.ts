import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TextFormat} from "../../models/textFormat";
import {SubMenuType} from "../../models/subMenuType";

@Component({
  selector: 'app-edit-bar',
  templateUrl: './edit-bar.component.html',
  styleUrls: ['./edit-bar.component.scss']
})
export class EditBarComponent {
  @Input() selectedIcon: any;
  @Output() selectIcon: EventEmitter<any> = new EventEmitter<any>();
  @Output() public colorSelected = new EventEmitter<string>();
  @Output() public thicknessSelected = new EventEmitter<number>();
@Input() public isFileSelected=false
  @Output() public buttonChanges = new EventEmitter<SubMenuType>();
  @Output() public textFormat = new EventEmitter<TextFormat>();
  @Output() public addNewTextBotton = new EventEmitter<[boolean, TextFormat]>();
  selectedIconIndex: number = -1;
  icons = [
    {name: 'tuiIconEdit2Large', label: 'Markup', type: SubMenuType.drawBrush},
    {name: 'tuiIconTypeLarge', label: 'Text', type: SubMenuType.text},
    {name: 'tuiIconSlidersLarge', label: 'Filter', type: SubMenuType.filter},
    {name: 'tuiIconCropLarge', label: 'Crop', type: SubMenuType.crop}
  ];

  handleColorChange(color: string) {
    this.colorSelected.emit(color);
  }

  handleAddNewTextBox(event: [boolean, TextFormat]) {
    this.addNewTextBotton.emit(event);
  }

  handleTextFormat(value: TextFormat) {
    this.textFormat.emit(value)

  }

  handleThicknessChange(thickness: number) {
    this.thicknessSelected.emit(thickness);
  }

  handleButtonChange(type: SubMenuType) {

    this.buttonChanges.emit(type)
  }

  selectIconM(index: number, type: SubMenuType) {
    if(!this.isFileSelected)
    return
    if (this.selectedIconIndex === index) {
      this.selectIcon.emit(SubMenuType.none)
      this.selectedIconIndex = -1;
    } else {
      this.selectedIconIndex = index;
      this.selectIcon.emit(type)

    }

  }


}
