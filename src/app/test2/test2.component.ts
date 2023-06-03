import { Component } from '@angular/core';
import { Storage } from '@google-cloud/storage';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.scss']
})
export class Test2Component {
  isOpen=true;

  closeModal(){
    this.isOpen=false;
  }
}
