import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {concatMap, finalize, last, map, Observable, of, switchMap, take, tap} from "rxjs";
import {SecuritySettingsService} from "./security-settings.service";
import {Modal} from "../models/modal";
import {Gallery} from "../models/gallery";
import {Picture} from "../models/picture";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {FileUpload} from "../models/file-upload.model";
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private basePath = '/images';

  constructor(private http: HttpClient,   private db:AngularFireDatabase,private storage:AngularFireStorage) {

  }


  pushFileToStorage(fileUpload: FileUpload): Observable<FileUpload> {
    const randomName = nanoid();
    const fileName = `${randomName}.${fileUpload.file.name.split('.').pop()}`;


    const filePath = `${this.basePath}/${fileName}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    return uploadTask.snapshotChanges().pipe(
      last(),
      concatMap(() => storageRef.getDownloadURL()),
      tap(downloadURL => {
        fileUpload.url = downloadURL;
        fileUpload.name = fileName;
        this.saveFileData(fileUpload);
      }),
      map(() => fileUpload)
    );
  }


  deleteFile(fileUpload: FileUpload): void {
    console.log(fileUpload)
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

  private selectedImage: HTMLImageElement | null = null;

  setSelectedImage(image: HTMLImageElement): void {
    this.selectedImage = image;
  }

  getSelectedImage(): HTMLImageElement | null {
    return this.selectedImage;
  }

  getImage(id: number): Observable<Picture> {
    return this.http.get<Picture>(`${environment.apiUrl}/api/Image/getImage/${id}`);
  }

  getImages(pageNb: number, pageSize: number, type: string, category: string[] | null) {
    let params = new HttpParams()
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())
      .set('type', type);
    if (Array.isArray(category) && category != null) {
      params = params.set("category", category.join(','))
    } else  if(!Array.isArray(category) && category != null){
      params = params.set("category", category);
    }
    return this.http.get<any>(`${environment.apiUrl}/api/Image/pages/`, {params});
  }

  getImagesByType(type: string) {

    return this.http.get<Picture[]>(`${environment.apiUrl}/api/Image/getImages/${type}`);
  }

  getImageType(id: number) {
    return this.http.get<string>(`${environment.apiUrl}/api/Image/getImageType/${id}`)

  }

  getImagesByAuthorID(pageNb: number, pageSize:number ,userId:number) {
    let params = new HttpParams()
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())
      .set('userId',userId)

    return this.http.get<Picture[]>(`${environment.apiUrl}/api/Image/getImagesByAuthorId/`,{params})

  }

  getCategory() {
    return this.http.get<any>(`${environment.apiUrl}/api/Category`)

  }


  getImageLikes(imageId:number,pageNb: number, pageSize:number ,userId:number,type:string) {
    console.log(userId)
    let params = new HttpParams()
      .set("id",imageId)
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())
      .set('userId',userId)
      .set('type',type)

    return this.http.get<Modal[]>(`${environment.apiUrl}/api/Image/getImageLikes/`, {params});
  }


  createImage(image:Picture):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/api/Image/create`,image);

  }


  deleteImage(imageId: number) {
    return this.http.delete<any>(`${environment.apiUrl}/api/Image/` + imageId);

  }

  getImagesByColor(image:Picture):Observable<any[]>{
  let params = new HttpParams()
    .set("queryImagePath",image.imageUrl)
    .set("imageTitle",image.title)
    return this.http.get<any[]>(`${environment.apiUrl}/api/Image/getSimi`, {params});

  }




}
function uuidv4() {
    throw new Error('Function not implemented.');
}

