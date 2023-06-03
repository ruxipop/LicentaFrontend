import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {defaultEditorColors} from '@taiga-ui/addon-editor';
import {FormControl} from "@angular/forms";

import {fabric} from "fabric";
import {TransferDataService} from "../service/transfer-data.service";
import {SubMenuType} from "../models/subMenuType";

@Component({
  selector: 'app-drawing-menu',
  templateUrl: './drawing-menu.component.html',
  styleUrls: ['./drawing-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawingMenuComponent implements AfterViewInit {
  @Output() colorChange = new EventEmitter<string>();
  @Output() thicknessChange = new EventEmitter<number>();
  @Output() buttonChanges = new EventEmitter<SubMenuType>();
  public drawTypes = SubMenuType;

  menuType:SubMenuType=SubMenuType.drawBrush

  fillToggle: boolean = false;
  outlineToggle: boolean = false;
  fillColor: string = "#000000";
  outlineColor: string = "#000000";
  outlineThickness: number = 1;


  constructor(private dataService: TransferDataService) {

    this.dataService.data$4.subscribe((filters) => {

    })
    // @ts-ignore


  }

  toggleFill() {
    this.fillToggle = !this.fillToggle;
  }

  toggleOutline() {

    this.outlineToggle = !this.outlineToggle;
  }

  readonly control = new FormControl(6.5);
  readonly palette = defaultEditorColors;

  selectedColor: string = 'red'; // Culoarea selectată inițial

  selectedThickness: number = 1; // Grosimea liniei selectată inițial

  selectColor() {
    this.colorChange.emit(this.selectedColor);
  }

  onThicknessChange() {
    this.thicknessChange.emit(this.selectedThickness);
  }



  clickButton(type:SubMenuType){
    this.menuType=type;
    this.buttonChanges.emit(type)
  }
  ngAfterViewInit(): void {
  }


  createRect() {
    console.log(this.outlineColor)
    const fill=this.fillToggle? this.fillColor:"rgba(0,0,0,0)"
    console.log(this.outlineToggle? this.outlineColor : fill)
    const rec=new fabric.Rect({
      width:100,
      height:100,
      fill:fill,
      originY:'center',
      originX:'center',
      stroke:this.outlineToggle? this.outlineColor : fill,
      strokeWidth:this.outlineToggle? this.outlineThickness:0

    })

    this.dataService.sendObject(rec);
  }


  createCircle(){
    const fill=this.fillToggle? this.fillColor:"rgba(0,0,0,0)"
    const rec=new fabric.Circle({
      radius:50,
      fill:fill,
      originY:'center',
      originX:'center',
      stroke:this.outlineToggle? this.outlineColor : fill,
      strokeWidth:this.outlineToggle? this.outlineThickness:0
    })
    this.dataService.sendObject(rec);
  }

  createTriangle(){
    const fill=this.fillToggle? this.fillColor:"rgba(0,0,0,0)"

    const rec = new fabric.Triangle({
      width: 100,
      height: 100,
      originY:'center',
      originX:'center',
      fill: fill,
      stroke:this.outlineToggle? this.outlineColor : fill,
      strokeWidth:this.outlineToggle? this.outlineThickness:0
    });
    this.dataService.sendObject(rec);

  }

  createStar(){
    const fill=this.fillToggle? this.fillColor:"rgba(0,0,0,0)"

    const star = new fabric.Polygon(
      [
        { x: 0, y: -50 },
        { x: 14, y: -14 },
        { x: 47, y: -14 },
        { x: 19, y: 11 },
        { x: 30, y: 45 },
        { x: 0, y: 25 },
        { x: -30, y: 45 },
        { x: -19, y: 11 },
        { x: -47, y: -14 },
        { x: -14, y: -14 }
      ],
      {
        fill: fill,
        stroke:this.outlineToggle? this.outlineColor : fill,
        strokeWidth:this.outlineToggle? this.outlineThickness:0
      }
    );
    this.dataService.sendObject(star)
  }


  createHeart(){
    const fill=this.fillToggle? this.fillColor:"rgba(0,0,0,0)"

    const heartPath = 'M 100 30 C 90 30 80 40 75 50 C 70 40 60 30 50 30 C 35 30 25 45 25 55 C 25 72 50 95 75 115 C 100 95 125 72 125 55 C 125 45 115 30 100 30 Z';
    const heart = new fabric.Path(heartPath, {

      fill: fill,
      stroke:this.outlineToggle? this.outlineColor : fill,
      strokeWidth:this.outlineToggle? this.outlineThickness:0
    });
this.dataService.sendObject(heart)
  }

  createHexagon() {
    const fill=this.fillToggle? this.fillColor:"rgba(0,0,0,0)"

    const hexagonSize = 100; // Dimensiunea laturii hexagonului

    const hexagonPoints = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = hexagonSize * Math.cos(angle);
      const y = hexagonSize * Math.sin(angle);
      hexagonPoints.push({ x, y });
    }

// Creează hexagonul ca un poligon
    const hexagon = new fabric.Polygon(hexagonPoints, {

      fill: fill,
      stroke:this.outlineToggle? this.outlineColor : fill,
      strokeWidth:this.outlineToggle? this.outlineThickness:0
    });


    this.dataService.sendObject(hexagon);
  }

}
