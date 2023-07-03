import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TextFormat} from "../../models/textFormat";
import {SubMenuType} from "../../models/subMenuType";

@Component({
  selector: 'app-edit-bar',
  templateUrl: './edit-bar.component.html',
  styleUrls: ['./edit-bar.component.scss']
})
export class EditBarComponent {
  @Input() selectedIcon: any; // Iconul selectat primit de la componenta părinte
  @Output() selectIcon: EventEmitter<any> = new EventEmitter<any>(); // Eveniment emis atunci când se selectează un icon
  @Output() public colorSelected = new EventEmitter<string>();
  @Output() public thicknessSelected = new EventEmitter<number>();

  @Output() public buttonChanges = new EventEmitter<SubMenuType>();
  @Output() public textFormat = new EventEmitter<TextFormat>();
  @Output() public addNewTextBotton = new EventEmitter<[boolean, TextFormat]>();


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

  selectedIconIndex: number = -1; // Proprietatea pentru iconul selectat

  icons = [
    {name: 'tuiIconEdit2Large', label: 'Markup', type: SubMenuType.drawBrush},
    {name: 'tuiIconTypeLarge', label: 'Text', type: SubMenuType.text},
    {name: 'tuiIconSlidersLarge', label: 'Filter', type: SubMenuType.filter},
    {name: 'tuiIconCropLarge', label: 'Crop', type: SubMenuType.crop}
  ];

  selectIconM(index: number, type: SubMenuType) {
    if (this.selectedIconIndex === index) {
      this.selectIcon.emit(SubMenuType.none)
      this.selectedIconIndex = -1; // Deselectați butonul dacă acesta este deja selectat
    } else {
      this.selectedIconIndex = index; // Actualizați indexul butonului selectat
      this.selectIcon.emit(type)

    }

  }


}
