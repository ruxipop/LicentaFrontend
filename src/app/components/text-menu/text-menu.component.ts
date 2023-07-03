import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {FormControl} from "@angular/forms";
import {TextFormat} from "../../models/textFormat";
import {TransferDataService} from "../../services/transfer-data.service";

@Component({
  selector: 'app-text-menu',
  templateUrl: './text-menu.component.html',
  styleUrls: ['./text-menu.component.scss', '../edit-bar/edit-bar.component.scss']
})
export class TextMenuComponent {
  readonly min = 5;
  readonly max = 20;
  readonly sliderStep = 1;
  readonly steps = (this.max - this.min) / this.sliderStep;
  readonly quantum = 0.01;
  @Output() textChanges = new EventEmitter<TextFormat>();
  @Output() addNewTextBox = new EventEmitter<[boolean, TextFormat]>();
  textFormat: TextFormat;

  readonly control = new FormControl(6.5);
 fontList = [
    'Arial',
    'Verdana',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Arial Black',
    'Tahoma',
    'Comic Sans MS',
    'Impact',
    'Lucida Sans Unicode',
    'Helvetica',
    'Calibri',
    'Garamond',
    'Palatino',
    'Century Gothic',
    'Trebuchet MS',
    'Baskerville',
    'Futura',
    'Rockwell',
    'Open Sans',
    'Roboto',
    'Montserrat',
    'Lato',
    'Oswald',
    'Raleway',
    'Noto Sans',
    'Playfair Display',
    'Cabin',
    'Source Sans Pro',
    'Avenir',
    'Merriweather'
  ];


  constructor(private dataService: TransferDataService) {
    this.dataService.data$3.subscribe((data) => {
      this.selectedColor = data.color;
      this.selectedFont = data.font
      this.fontSize=data.size.toFixed(1)

    });
  }

  selectedColor: string = '#000000';
  selectedFont: string = 'Arial';
  isBold: boolean = false;
  isUnderline: boolean = false;
  isItalic: boolean = false;
  fontSize: number = 15;


  addNewText() {
    this.createFont()
    this.addNewTextBox.emit([true, this.textFormat]);
  }

  emitText() {
    this.textChanges.emit(this.textFormat)
  }

  createFont() {
    this.textFormat = new TextFormat(this.selectedFont, (this.isBold ? 'bold' : null), (this.isUnderline ? 'underline' : null), (this.isItalic ? 'italic' : null), this.selectedColor, this.fontSize)
  }

  onColorChange(color: any) {
    this.selectedColor = color.target.value;
    this.createFont()
    this.emitText();


  }

  onFontChange(font: any) {
    this.selectedFont = font;
    this.createFont()
    this.emitText();
  }

  toggleBold() {
    this.isBold = !this.isBold;
    this.createFont()
    this.emitText();

  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
    this.createFont()
    this.emitText();

  }

  toggleUnderline() {
    this.isUnderline = !this.isUnderline;
    this.createFont()
    this.emitText();

  }

  onFontSizeChange() {
    this.createFont();
    this.emitText();
  }

  onFontSizeLabelChange(innerText: string) {

    const parsedValue = parseFloat(innerText);
    if (!isNaN(parsedValue)) {
      this.fontSize = parsedValue;
      this.createFont();
      this.emitText();
    }
  }



}
