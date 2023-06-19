import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {SecuritySettingsService} from "./security-settings.service";
import {Modal} from "../models/modal";
import {Gallery} from "../models/gallery";
import {Picture} from "../models/picture";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient,   private settings: SecuritySettingsService) {

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
    console.log("post")
    return this.http.post<any>(`${environment.apiUrl}/api/Image/create`,image);

  }
}
