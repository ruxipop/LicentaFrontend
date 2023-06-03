import {AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild} from '@angular/core';
import {fabric} from "fabric";
import {TransferDataService} from "../service/transfer-data.service";
import {Subscription} from "rxjs";
import {TextFormat} from "../models/textFormat";
import {SubMenuType} from "../models/subMenuType";
import 'fabric-history';


@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements AfterViewInit, OnDestroy {
  public selectedColor: string = '#000000';
  @Input() public addButton: boolean = false;
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  canvas!: fabric.Canvas;
  selectedFile: any | boolean = false;
  currentIndex: number;
  private isDrawing: boolean = false;
  private dataSubscription: Subscription;

  textboxesMap: Map<fabric.Textbox, number> = new Map();
  private undoStack: any[] = [];
  index: number = 0;
  currentIndex3: number = -1;
  // stateManager: StateManager;

  mementoCanvas: ImageData;
  canvasHistory: any[] = [];
  currentHistoryIndex = -1;
  undo(): void {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      this.canvas.loadFromJSON(this.canvasHistory[this.currentHistoryIndex], () => {
        this.canvas.renderAll();
      });
    }
  }

  redo(): void {
    if (this.currentHistoryIndex < this.canvasHistory.length - 1) {
      this.currentHistoryIndex++;
      this.canvas.loadFromJSON(this.canvasHistory[this.currentHistoryIndex], () => {
        this.canvas.renderAll();
      });
    }
  }



  saveState() {

    const json = this.canvas.toJSON();
    const currentState = JSON.stringify(json);
    if (this.currentHistoryIndex < this.canvasHistory.length - 1) {
      this.canvasHistory.splice(this.currentHistoryIndex + 1);
    }
    this.canvasHistory.push(currentState);
    this.currentHistoryIndex++;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();

      this.handleRequest();
      this.saveState()

    }
  }


  handleRequest() {
    let obj = this.canvas.getActiveObject()
    if (obj instanceof fabric.Textbox) {
      // @ts-ignore
      const customIndex = this.textboxesMap.get(obj);
      // @ts-ignore
      this.textboxesMap.delete(customIndex)
      this.canvas.remove(obj);

      obj = null
 this.canvas.renderAll()
      this.saveState()

    }
  }

  constructor(private dataService: TransferDataService) {
    // this.stateManager = new StateManager(this.canvas);

    this.dataService.data$.subscribe((data) => {
      if (Array.isArray(data)) {
        switch (data.length) {
          case 2:
            if (typeof data[0] === 'boolean' && data[1] instanceof TextFormat) {
              this.onCli(data[1])
            }

            break;
          case 1:
            if (data[1] instanceof TextFormat) {
              this.changeTextFillColor(data[0]);
            }
            break;
          default:
        }
      } else {
        if (data instanceof TextFormat) {
          this.changeTextFillColor(data);
        }
        else if (data instanceof fabric.Image.filters.BaseFilter) {


          this.applyFilter(data)
        }
        else if (typeof data === "boolean") {


          this.appliedFilter.forEach(obj => {
            obj.value = false;
          });

        }
        else if (Object.values(SubMenuType).includes(data)) {

          this.selectSubMenu(data)
        }


        else if (typeof data === "string" ) {
          console.log("4 if" +data)

          this.canvas.freeDrawingBrush.color = data
          this.canvas.renderAll()
          // this.toggleMode()

        } else if (typeof data === "number") {
          console.log("5 if")

          this.canvas.freeDrawingBrush.width = data
          this.canvas.renderAll()
          // this.toggleMode()

        } else {
          this.addObject(data)
          console.log("ba esti nebun")
        }
      }
    });

  }
  getCurrentCanvasState(): string {
    return JSON.stringify(this.canvas.toJSON());
  }
  addObject(obj:any){
    const canvCenter=this.canvas.getCenter();
    obj.top=canvCenter.top
    obj.left=canvCenter.left

    this.canvas.add(obj)

    this.canvas.renderAll()
    this.saveState()


  }
  onCli(textFormat: TextFormat) {
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

    this.textboxesMap.set(textBox, this.index);
    this.index++;
    this.canvas.add(textBox);
    this.canvas.renderAll()
    this.saveState()

    textBox.on('scaling', event => {
      var scale = textBox.scaleX; // Obține scala pe axa X (se presupune că scalarea are loc proporțional)
      var originalFontSize = textBox.fontSize; // Obține dimensiunea fontului inițială
      // @ts-ignore
      var newFontSize = originalFontSize * scale;
      //@ts-ignore
      this.dataService.sendData2(new TextFormat(textBox.fontFamily, textBox.fontWeight, textBox.underline, textBox.fontStyle, textBox.fill, newFontSize));
    this.canvas.renderAll()
      this.saveState()
    })
  }


  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      // selection: true
    });
    this.canvas.setWidth(800);
    this.canvas.setHeight(500);
    // this.canvas.setCursor('default')
    // this.canvas.selection = true
    ;
    this.canvas.on('object:moving', (event) => {
this.saveState()      // Aici poți executa cod suplimentar în funcție de mișcarea obiectului
    });

    this.canvas.on('selection:created', event => {
      // @ts-ignore
      const obj = this.canvas.getActiveObject()
      if (obj instanceof fabric.Textbox) {
        // @ts-ignore
        const customIndex = this.textboxesMap.get(obj);
        // @ts-ignore
        this.currentIndex = customIndex;
        const activeTextbox = Array.from(this.textboxesMap.keys())[this.currentIndex];
        // @ts-ignore
        this.dataService.sendData2(new TextFormat(activeTextbox.fontFamily, activeTextbox.fontWeight, activeTextbox.underline, activeTextbox.fontStyle, activeTextbox.fill, activeTextbox.fontSize));
     this.canvas.renderAll()
        this.saveState()
      }
    });


    this.canvas.on('selection:updated', event => {
      // @ts-ignore
      const obj = this.canvas.getActiveObject()
      if (obj instanceof fabric.Textbox) {
        // @ts-ignore
        const customIndex = this.textboxesMap.get(obj);
        // @ts-ignore
        this.currentIndex = customIndex;
        const activeTextbox = Array.from(this.textboxesMap.keys())[this.currentIndex];
        // @ts-ignore
        this.dataService.sendData2(new TextFormat(activeTextbox.fontFamily, activeTextbox.fontWeight, activeTextbox.underline, activeTextbox.fontStyle, activeTextbox.fill, activeTextbox.fontSize));
        this.canvas.renderAll()

        this.saveState()
      }
    });
    let mousedPressed = false;

    this.canvas.on("mouse:move", (event) => {

      // if (mousedPressed && this.currentMode === this.modes.pan) {
      //   const mEvent = event.e
      //   this.canvas.setCursor('grab')
      //   this.canvas.renderAll()
      //   const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
      //   this.canvas.relativePan(delta)
      // }
      console.log("moue" +mousedPressed)


    })

    this.canvas.on("mouse:down", (event) => {
      mousedPressed = true;

      // if (this.currentMode === this.modes.pan) {
      //   this.canvas.setCursor('grab')
      //   this.canvas.renderAll()
      // }

    })
    this.canvas.on("mouse:up", (event) => {
      if(this.currentSubMenu===SubMenuType.drawBrush && mousedPressed ){
        console.log("asta salveaza")
        this.canvas.renderAll()

        this.saveState()
      }
      mousedPressed = false;
      // this.canvas.setCursor('default')
      // this.canvas.renderAll()


    })

  }







  currentSubMenu: SubMenuType = SubMenuType.none;

  selectSubMenu(type: SubMenuType) {
    this.currentSubMenu = type;
    if (type === SubMenuType.drawBrush) {
      this.canvas.freeDrawingBrush.color = "#000000"
      this.canvas.isDrawingMode = true;
      this.canvas.renderAll()
    } else if (type === SubMenuType.none) {
        ///pune in ficare asta
      this.canvas.isDrawingMode = false;
      this.canvas.renderAll()
    }
    else if (type === SubMenuType.drawShape) {
      ///pune in ficare asta
      this.canvas.isDrawingMode = false;
      this.canvas.renderAll()
    }else if (type === SubMenuType.filter) {
      ///pune in ficare asta
      this.canvas.isDrawingMode = false;
      this.canvas.renderAll()
    }else if (type === SubMenuType.text) {
      ///pune in ficare asta
      this.canvas.isDrawingMode = false;
      this.canvas.renderAll()
    }
  }

  changeTextFillColor(textForm: TextFormat) {
    const activeTextbox = Array.from(this.textboxesMap.keys())[this.currentIndex];
    if (activeTextbox) {
      activeTextbox.set('fill', textForm.color);
      activeTextbox.set('fontSize', textForm.size);
      activeTextbox.set('fontFamily', textForm.font)
      if (textForm.italic != null) {
        // @ts-ignore
        activeTextbox.set('fontStyle', textForm.italic)
      } else {
        activeTextbox.set('fontStyle', "normal")

      }
      if (textForm.bold != null) {
        activeTextbox.set('fontWeight', textForm.bold)
      } else {
        activeTextbox.set('fontWeight', "normal")
      }
      if (textForm.underline != null) {
        activeTextbox.set('underline', true)
      } else {
        activeTextbox.set('underline', false)
      }
      this.canvas.renderAll();
      this.saveState()

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

      // @ts-ignore
      if (imageWidth > containerWidth || imageHeight > containerHeight) {
        // @ts-ignore

        const widthRatio = containerWidth / imageWidth;
        // @ts-ignore

        const heightRatio = containerHeight / imageHeight;

        scaleFactor = Math.min(widthRatio, heightRatio);
      }
      // @ts-ignore

      const newWidth = imageWidth * scaleFactor;
      // @ts-ignore

      const newHeight = imageHeight * scaleFactor;

      const left = (containerWidth - newWidth) / 2;
      const top = (containerHeight - newHeight) / 2;

      image.set({
        left: left,
        top: top,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        selectable: false
      });

      this.canvas.setCursor('default'); // Setează cursorul pe 'default' după încărcarea imaginii

      this.image = image;
      // Inside the ngAfterViewInit method

      this.canvas.add(image);
      this.canvas.renderAll();
      this.saveState()

      // this.saveHistory()

    });
  }

  image: fabric.Image;

  cropped = new Image();

   selectionRect:fabric.Rect

  addRect() {
    this.selectionRect = new fabric.Rect({
      fill: "rgba(0,0,0,0.3)",
      originX: "left",
      originY: "top",
      stroke: "black",
      opacity: 1,
      width: this.image.width,
      height:this.image.height,
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
   this. canvas.centerObject(this.selectionRect);
   this. canvas.add(this.selectionRect);
    this.canvas.setActiveObject(this.selectionRect);
    this.canvas.renderAll();
  }

  cropImage() {
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
      // this.canvas.remove(this.image); // Remove the existing image
      this.canvas.add(img); // Add the new image to the canvas
      this.image = img; // Assign the new image

      this.canvas.renderAll();
      this.saveState()

    });
  }


  private flippedX = false;
  private flippedY = false;
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
      this.canvas.setCursor('default'); // Setează cursorul pe 'default' după încărcarea imaginii

    };
    reader.readAsDataURL(file);
    this.selectedFile = true;


  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.loadImageFromFile(file);
    }
  }


  deleteImage() {
    this.canvas.clear();
    this.textboxesMap.clear()
    this.selectedFile = false;
    this.appliedFilter = []
  }

  downloadImage() {
    console.log("tr")
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      multiplier: 1
    });
    const anchor = document.createElement('a');
    anchor.href = dataURL;
    anchor.download = 'image.png';
    anchor.click();


  }

  appliedFilter: { filter: fabric.IBaseFilter, value: boolean }[] = [];

  applyFilter(filter: fabric.IBaseFilter) {

    if (this.image) {

      // @ts-ignore
      const existingFilterIndex = this.appliedFilter.findIndex(
        (applied) => applied.filter instanceof filter.constructor
      );
      // @ts-ignore
      const lastFilterIndex = this.image.filters.findLastIndex(filter => filter instanceof filter.constructor);

      if (filter instanceof fabric.Image.filters.Grayscale) {
        // @ts-ignore
        this.image.filters.splice(existingFilterIndex, 1);
      }

      if (existingFilterIndex === -1) {
        console.log(" nu exista ||false")
        // @ts-ignore
        this.image.filters.push(filter);
        this.appliedFilter.push({"filter": filter, "value": true});
      } else {
        console.log("value " + this.appliedFilter[existingFilterIndex].value)
        if (!this.appliedFilter[existingFilterIndex].value) {
          // @ts-ignore
          this.image.filters.push(filter);
          this.appliedFilter[existingFilterIndex].value = true;

        } else {
          console.log("exista")
          // @ts-ignore
          this.image.filters[lastFilterIndex] = filter;

        }
      }


      this.image.applyFilters();
      this.canvas.renderAll();
      this.saveState()

    }
  }


  undoFilter() {
    if (this.image) {
      // @ts-ignore
      if (this.image.filters.length > 0) {
        // @ts-ignore
        this.image.filters.pop();
        this.image.applyFilters();
        this.canvas.renderAll();
      }
    }
  }


  restoreState(state: fabric.Object[]) {
    // Clear the canvas
    this.canvas.clear();

    // Add the objects from the state back to the canvas
    state.forEach(obj => {
      const clonedObj = fabric.util.object.clone(obj);
      this.canvas.add(clonedObj);
    });

    // Render all objects on the canvas
    this.canvas.renderAll();
  }




}

