import {ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {CustomDialogComponent} from "../components/custom-dialog/custom-dialog.component";
import {AlertService} from "../services/alert.service";
import {ConfirmDialogComponent} from "../components/confirm-dialog/confirm-dialog.component";
import {ImageService} from "../services/image.service";
import {Observable} from "rxjs";
import {Picture} from "../models/picture";

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrls: ['./test2.component.scss']
})
export class Test2Component implements OnInit{
  image:string[]=[]
  constructor(private dialog: MatDialog,private imageService:ImageService) {

  }

ngOnInit() {
 this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')
  this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')

  this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')
  this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')
  this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')
  this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')

  this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')

  this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')
  this.image.push('assets/imgs/93dfb9c0-37ff-40bc-ab89-67bbbd031879.jpg')






}

  openCustomDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {message: 'Mesaj personalizat', type: 'success'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        console.log("ok")
        // Logica pentru butonul OK
      } else if (result === 'cancel') {
        // Logica pentru butonul Cancel
      }
    });
  }
}
