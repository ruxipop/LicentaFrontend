import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {fabric} from "fabric";
import {TransferDataService} from "../../services/transfer-data.service";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss', '../edit-bar/edit-bar.component.scss']
})
export class FiltersComponent implements OnInit {
  blurIntensity: number = 0.0;
  saturationValue: number = 0.0;
  noiseValue: number = 0.0;
  pixelateValue: number = 0;
  contrastValue: number = 0;
  brightnessValue: number = 0;
  hueValue: number = 45;
  testForm: FormGroup;
  sepiaValue: number = 0;

  constructor(private dataService: TransferDataService) {

    this.dataService.data$4.subscribe((filters) => {

    })
    // @ts-ignore


  }

  ngOnInit() {
    this.testForm = new FormGroup({
      Invert: new FormControl(false),
      Grayscale: new FormControl(false),

    });
    Object.keys(this.testForm.controls).forEach((controlName) => {
      const control = this.testForm.get(controlName);

      // @ts-ignore
      control.valueChanges.subscribe((value) => {
        switch (controlName) {
          case "Invert":
            this.applyInvertFilter(value)
            break
          case "Grayscale":
            this.applyGrayscaleFilter(value);
            break
        }

      });
    });
  }


  applyGrayscaleFilter(value: boolean) {
    console.log("value" + value)
    const grayscaleFilter = new fabric.Image.filters.Grayscale({})
    this.dataService.sendData4(grayscaleFilter)
  }

  applySepiaFilter() {
    console.log(this.sepiaValue)
    const sepiaFilter = new fabric.Image.filters.Sepia({
      sepia: this.sepiaValue,
    });
    this.dataService.sendData4(sepiaFilter)
  }

  applyInvertFilter(value: boolean) {
    const invertFilter = new fabric.Image.filters.Invert({
      invert: value // Setați la true sau false în funcție de necesități
    });
    this.dataService.sendData4(invertFilter)
  }

  applyBlurFilter() {
    const blurFilter = new fabric.Image.filters.Blur({
      blur: this.blurIntensity
    });
    this.dataService.sendData4(blurFilter)
  }


  applySaturationFilter() {
    const saturationFilter = new fabric.Image.filters.Saturation({
      saturation: this.saturationValue
    });
    this.dataService.sendData4(saturationFilter)
  }

  applyNoiseFilter() {
    const noiseFilter = new fabric.Image.filters.Noise({
      noise: this.noiseValue
    });
    this.dataService.sendData4(noiseFilter)
  }

  applyPixelateFilter() {
    console.log("pix " + this.pixelateValue)
    const pixelateFilter = new fabric.Image.filters.Pixelate({
      blocksize: this.pixelateValue
    });
    this.dataService.sendData4(pixelateFilter)
  }

  applyContrastFilter() {
    console.log(this.contrastValue)
    const constrastFilter = new fabric.Image.filters.Contrast({
      contrast: this.contrastValue
    });
    this.dataService.sendData4(constrastFilter)
  }

  applyBrightnessFilter() {
    const brightnessFilter = new fabric.Image.filters.Brightness({
      brightness: this.brightnessValue
    });
    this.dataService.sendData4(brightnessFilter)
  }

  applyHueFilter() {
    const hueRotationFilter = new fabric.Image.filters.HueRotation({
      rotation: this.hueValue
    });
    this.dataService.sendData4(hueRotationFilter)
  }
}
