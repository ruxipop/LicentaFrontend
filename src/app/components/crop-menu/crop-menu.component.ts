import {Component} from '@angular/core';
import {TransferDataService} from "../../services/transfer-data.service";

@Component({
  selector: 'app-crop-menu',
  templateUrl: './crop-menu.component.html',
  styleUrls: ['./crop-menu.component.scss', '../edit-bar/edit-bar.component.scss']
})
export class CropMenuComponent {
  isCropOpen: boolean = false;

  constructor(private dataService: TransferDataService) {

  }

  flipHorizontal() {
    this.dataService.sendObject("flipX")
  }

  flipVertical() {
    this.dataService.sendObject("flipY")
  }

  rotateLeft() {
    this.dataService.sendObject("rotateLeft");

  }

  rotateRight() {
    this.dataService.sendObject("rotateRight")

  }

  addRectCrop() {
    this.isCropOpen = true;
    this.dataService.sendObject("cropRect")

  }

  closeCrop() {
    this.isCropOpen = false;
    this.dataService.sendObject('closeCrop')
  }

  applyCrop() {
    this.dataService.sendObject('cropImage');
    this.isCropOpen = false;
  }
}

