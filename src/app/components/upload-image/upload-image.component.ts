import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {fabric} from "fabric";
import {TransferDataService} from "../../services/transfer-data.service";
import {Subscription} from "rxjs";
import {TextFormat} from "../../models/textFormat";
import {SubMenuType} from "../../models/subMenuType";
import 'fabric-history';


@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements AfterViewInit, OnDestroy {
  selectObject: any;
  @Input() public addButton: boolean = false;
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  canvas!: fabric.Canvas;
  selectedFile: any | boolean = false;
  currentIndex: number;
  textBoxesMap: Map<fabric.Textbox, number> = new Map();
  index: number = 0;
  canvasHistory: any[] = [];
  currentHistoryIndex = -1;
  currentSubMenu: SubMenuType = SubMenuType.none;
  image: fabric.Image;
  isRectCrop: boolean = false;
  selectionRect: fabric.Rect
  appliedFilter: { filter: fabric.IBaseFilter, value: boolean }[] = [];
  private mousedPressed = false;
  private dataSubscription: Subscription;
  private angle: number = 0;
  private flippedX = false;
  private flippedY = false;
  @Output() isFileSelected= new EventEmitter<boolean>();

  constructor(private dataService: TransferDataService) {
    this.dataService.data$.subscribe((data) => {
      this.handleData(data);
    });
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    this.attachCanvasEventHandlers();
  }

  saveState(filter: any) {

    const json = this.canvas.toJSON();
    const currentState = JSON.stringify(json);
    if (this.currentHistoryIndex < this.canvasHistory.length - 1) {
      this.canvasHistory.splice(this.currentHistoryIndex + 1);
    }
    this.canvasHistory.push({state: currentState, operation: filter});
    this.currentHistoryIndex++;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();

      this.handleRequest();
      this.saveState(false)

    }
  }

  handleRequest() {
    let obj = this.canvas.getActiveObject()
    if (obj instanceof fabric.Textbox) {
      // @ts-ignore
      const customIndex = this.textBoxesMap.get(obj);
      // @ts-ignore
      this.textBoxesMap.delete(customIndex)
      this.canvas.remove(obj);
      obj = null
      this.canvas.renderAll()
      this.saveState(false)

    }
  }

  handleData(data: any): void {
    if (Array.isArray(data)) {
      this.handleArrayData(data);
    } else {
      this.handleNonArrayData(data);
    }
  }

  handleArrayData(data: any[]): void {
    switch (data.length) {
      case 2:
        if (typeof data[0] === 'boolean' && data[1] instanceof TextFormat) {
          this.createTextBox(data[1]);
        }
        break;
      case 1:
        if (data[1] instanceof TextFormat) {
          this.changeTextFillColor(data[0]);
        }
        break;
      default:
    }
  }

  handleNonArrayData(data: any): void {
    if (data instanceof TextFormat) {
      this.changeTextFillColor(data);
    } else if (data instanceof fabric.Image.filters.BaseFilter) {
      this.applyFilter(data);
    } else if (typeof data === "boolean") {
      this.resetAppliedFilter();
    } else if (Object.values(SubMenuType).includes(data)) {
      this.selectSubMenu(data);
    } else if (typeof data === 'string') {
      this.handleStringData(data);
    } else if (typeof data === "number") {
      this.handleNumberData(data);
    } else {
      this.addObject(data);
    }
  }

  resetAppliedFilter(): void {
    this.appliedFilter.forEach(obj => {
      obj.value = false;
    });
  }

  handleStringData(data: string): void {
    switch (data) {
      case 'flipX':
        this.flipX();
        break;
      case 'flipY':
        this.flipY();
        break;
      case 'rotateLeft':
        this.rotateImageLeft();
        break;
      case 'rotateRight':
        this.rotateImageRight();
        break;
      case 'cropRect':
        this.addRectCrop();
        break;
      case 'closeCrop':
        this.closeRectCrop();
        break;
      case 'cropImage':
        this.cropImage();
        break;
      default:
        this.canvas.freeDrawingBrush.color = data;
        this.canvas.renderAll();
        break;
    }
  }

  handleNumberData(data: number): void {
    this.canvas.freeDrawingBrush.width = data;
    this.canvas.renderAll();
  }

  addObject(obj: any) {
    const canvasCenter = this.canvas.getCenter();
    obj.top = canvasCenter.top
    obj.left = canvasCenter.left
    this.canvas.add(obj)
    this.canvas.renderAll()
    this.saveState(false)


  }

  createTextBox(textFormat: TextFormat) {
    const textBox = new fabric.Textbox('Enter text', {
      left: 50,
      top: 50,
      width: 200,
      fontSize: textFormat.size,
      fill: textFormat.color,
      fontFamily: textFormat.font,
      // @ts-ignore
      fontStyle: textFormat.italic == null ? "normal" : textFormat.italic,
      fontWeight: textFormat.bold == null ? "normal" : textFormat.bold,
      underline: textFormat.underline != null
    });

    this.textBoxesMap.set(textBox, this.index);
    this.index++;
    this.canvas.add(textBox);
    this.canvas.renderAll()
    this.saveState(false)

    textBox.on('scaling', () => {
      let scale = textBox.scaleX;
      let originalFontSize = textBox.fontSize;
      let newFontSize = originalFontSize * scale;
      //@ts-ignore
      this.dataService.sendData2(new TextFormat(textBox.fontFamily, textBox.fontWeight, textBox.underline, textBox.fontStyle, textBox.fill, newFontSize));
      this.canvas.renderAll()
      this.saveState(false)
    })


  }

  initializeCanvas() {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);
    this.canvas.setWidth(800);
    this.canvas.setHeight(500);
  }

  attachCanvasEventHandlers() {
    this.canvas.on('object:moving', this.onObjectMoving.bind(this));
    this.canvas.on('selection:created', this.onSelectionCreated.bind(this));
    this.canvas.on('selection:updated', this.onSelectionUpdated.bind(this));
    this.canvas.on('mouse:down', this.onMouseDown.bind(this));
    this.canvas.on('mouse:up', this.onMouseUp.bind(this));
  }

  onObjectMoving() {
    this.saveState(false);
  }

  onSelectionCreated() {
    if (this.canvas.getActiveObject() instanceof fabric.Image) {
    }

    this.selectObject = this.canvas.getActiveObject();
    this.handleActiveTextBox();
  }

  onSelectionUpdated() {
    this.selectObject = this.canvas.getActiveObject();
    this.handleActiveTextBox();
  }

  onMouseDown() {
    this.mousedPressed = true;
  }

  onMouseUp() {
    if (this.currentSubMenu === SubMenuType.drawBrush && this.mousedPressed) {
      this.canvas.renderAll();
      this.saveState(false);
    }
    this.mousedPressed = false;
  }

  handleActiveTextBox() {
    if (this.selectObject instanceof fabric.Textbox) {
      this.currentIndex = this.textBoxesMap.get(this.selectObject);
      const activeTextBox = Array.from(this.textBoxesMap.keys())[this.currentIndex];
      //@ts-ignore
      this.dataService.sendData2(new TextFormat(activeTextBox.fontFamily, activeTextBox.fontWeight, activeTextBox.underline, activeTextBox.fontStyle, activeTextBox.fill, activeTextBox.fontSize));
      this.canvas.renderAll();
      this.saveState(false);
    }
  }

  deleteSelectedObject() {
    this.canvas.remove(this.selectObject);
    this.canvas.discardActiveObject();
    this.selectObject = null;
    this.canvas.renderAll();
  }

  selectSubMenu(type: SubMenuType) {
    this.currentSubMenu = type;

    if (type === SubMenuType.drawBrush) {
      this.canvas.freeDrawingBrush.color = "#000000"
      this.canvas.isDrawingMode = true;
    } else {
      this.canvas.isDrawingMode = false;
    }
    this.canvas.renderAll()
  }

  changeTextFillColor(textForm: TextFormat) {
    const activeTextBox = Array.from(this.textBoxesMap.keys())[this.currentIndex];
    if (activeTextBox) {
      activeTextBox.set('fill', textForm.color);
      activeTextBox.set('fontSize', textForm.size);
      activeTextBox.set('fontFamily', textForm.font)
      if (textForm.italic != null) {
        // @ts-ignore
        activeTextBox.set('fontStyle', textForm.italic)
      } else {
        activeTextBox.set('fontStyle', "normal")

      }
      if (textForm.bold != null) {
        activeTextBox.set('fontWeight', textForm.bold)
      } else {
        activeTextBox.set('fontWeight', "normal")
      }
      if (textForm.underline != null) {
        activeTextBox.set('underline', true)
      } else {
        activeTextBox.set('underline', false)
      }
      this.canvas.renderAll();
      this.saveState(false)

    }
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  onDragOver(event: any) {
    event.preventDefault();
    this.addDraggingClass();
  }

  addDraggingClass() {
    const container = this.canvas.getElement().parentNode as HTMLElement;
    container.classList.add('dragging');
  }

  removeDraggingClass() {
    const container = this.canvas.getElement().parentNode as HTMLElement;
    container.classList.remove('dragging');
  }

  onDrop(event: any) {
    event.preventDefault();
    this.removeDraggingClass();
    const file: File = event.dataTransfer.files[0];
    if (file) {
      this.loadImageFromFile(file);
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.canvas.isDrawingMode = false;

  }

  addImageToCanvas(imageUrl: string) {
    fabric.Image.fromURL(imageUrl, (image) => {
      const containerWidth = this.canvas.getWidth();
      const containerHeight = this.canvas.getHeight();
      this.canvas.setWidth(800)
      this.canvas.setHeight(500)
      const imageWidth = image.width;
      const imageHeight = image.height;

      let scaleFactor = 1;

      if (imageWidth > containerWidth || imageHeight > containerHeight) {
        const widthRatio = containerWidth / imageWidth;
        const heightRatio = containerHeight / imageHeight;
        scaleFactor = Math.min(widthRatio, heightRatio);
      }

      const newWidth = imageWidth * scaleFactor;
      const newHeight = imageHeight * scaleFactor;
      const left = (containerWidth - newWidth) / 2;
      const top = (containerHeight - newHeight) / 2;

      image.set({
        left: left,
        top: top,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        selectable: false,
        angle: this.angle
      });

      this.canvas.setCursor('default');

      this.image = image;
      this.canvas.add(image);
      this.canvas.renderAll();
      this.saveState(false)
    });
  }

  closeRectCrop() {
    this.canvas.remove(this.selectionRect)
    this.isRectCrop = false;
  }

  addRectCrop() {
    if (!this.isRectCrop) {
      this.selectionRect = new fabric.Rect({
        fill: "rgba(0,0,0,0.3)",
        originX: "left",
        originY: "top",
        stroke: "black",
        opacity: 1,
        width: this.image.width,
        height: this.image.height,
        hasRotatingPoint: false,
        transparentCorners: false,
        cornerColor: "white",
        cornerStrokeColor: "black",
        borderColor: "black",
        cornerSize: 12,
        padding: 0,
        cornerStyle: "circle",
        borderDashArray: [5, 5],
        borderScaleFactor: 1.3,

      });
      this.selectionRect.scaleToWidth(300);
      this.canvas.centerObject(this.selectionRect);
      this.canvas.add(this.selectionRect);
      this.canvas.setActiveObject(this.selectionRect);
      this.isRectCrop = true;
      this.canvas.renderAll();
    }
  }

  cropImage() {
    this.isRectCrop = false
    const objects = this.canvas.getObjects();

    const rect = new fabric.Rect({
      left: this.selectionRect.left,
      top: this.selectionRect.top,
      width: this.selectionRect.getScaledWidth(),
      height: this.selectionRect.getScaledHeight(),
      absolutePositioned: true,
    });

    this.image.clipPath = rect;
    this.canvas.remove(this.selectionRect);

    const dataURL = this.canvas.toDataURL({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      multiplier: 1,
    });

    fabric.Image.fromURL(dataURL, (img) => {
      img.set({
        left: rect.left,
        top: rect.top,
      });
      objects.forEach((obj) => {

        this.canvas.remove(obj);

      });
      this.canvas.add(img);
      this.image = img;

      this.canvas.renderAll();
      this.saveState(false)

    });
  }

  flipX() {
    this.flippedX = !this.flippedX;
    this.image.flipX = this.flippedX;
    this.canvas.renderAll();
  }

  flipY() {
    this.flippedY = !this.flippedY;
    this.image.flipY = this.flippedY;
    this.canvas.renderAll();
  }

  loadImageFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.addImageToCanvas(e.target.result);
      this.canvas.setCursor('default');

    };
    reader.readAsDataURL(file);
    this.selectedFile = true;
    this.isFileSelected.emit(true)


  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.loadImageFromFile(file);
    }
  }

  deleteImage() {
    this.canvas.clear();
    this.textBoxesMap.clear()
    this.selectedFile = false;
    this.appliedFilter = []
    this.isFileSelected.emit(false)
  }

  downloadImage() {
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      multiplier: 1
    });
    const anchor = document.createElement('a');
    anchor.href = dataURL;
    anchor.download = 'image.png';
    anchor.click();


  }

  rotateImageRight() {
    this.angle = (this.angle + 90) % 360;
    this.image.rotate(this.angle);
    this.canvas.renderAll();
  }

  rotateImageLeft() {
    this.angle = (this.angle - 90 + 360) % 360;
    this.image.rotate(this.angle);
    this.canvas.renderAll();
  }

  undo(): void {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      this.canvas.loadFromJSON(this.canvasHistory[this.currentHistoryIndex].state, () => {
        this.canvas.renderAll();
      });
    }
  }

  redo(): void {
    if (this.currentHistoryIndex < this.canvasHistory.length - 1) {
      this.currentHistoryIndex++;
      this.canvas.loadFromJSON(this.canvasHistory[this.currentHistoryIndex].state, () => {
        this.canvas.renderAll();
      });
    }
  }

  applyFilter(filter: fabric.IBaseFilter) {
    if (this.image) {
      const existingFilterIndex = this.image.filters.findIndex(
        (applied) => applied instanceof filter.constructor
      );

      if (existingFilterIndex === -1) {

        this.image.filters.push(filter);
        this.appliedFilter.push({filter: filter, value: true});
      } else {
        if (filter instanceof fabric.Image.filters.Grayscale) {

          if (this.appliedFilter[existingFilterIndex].value) {
            this.image.filters.splice(existingFilterIndex, 1);
            this.appliedFilter[existingFilterIndex].value = false;
          } else {
            this.image.filters.push(filter);
            this.appliedFilter[existingFilterIndex].value = true;
          }
        } else {
          this.image.filters[existingFilterIndex] = filter;
          this.appliedFilter[existingFilterIndex].value = true;
        }
      }

      this.image.applyFilters();
      this.canvas.renderAll();
      this.saveState(filter)
    }
  }



}

