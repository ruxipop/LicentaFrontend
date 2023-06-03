import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Image} from "../models/image";
import {Observable} from "rxjs";
import {SecuritySettingsService} from "./security-settings.service";
import {LikesModal} from "../models/likesModal";

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

  getImage(id: number): Observable<Image> {
    return this.http.get<Image>(`${environment.apiUrl}/api/Image/getImage/${id}`);
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
    console.log(params.get("category"))
    return this.http.get<any>(`${environment.apiUrl}/api/Image/pages/`, {params, headers: this.settings.getHeaders()});
  }

  getImagesByType(type: string) {

    return this.http.get<Image[]>(`${environment.apiUrl}/api/Image/getImages/${type}`);
  }

  getImageType(id: number) {
    return this.http.get<string>(`${environment.apiUrl}/api/Image/getImageType/${id}`)

  }

  getImagesByAuthorID(id: number) {
    return this.http.get<Image[]>(`${environment.apiUrl}/api/Image/getImagesByAuthorId/${id}`)

  }

  getCategory() {
    return this.http.get<any>(`${environment.apiUrl}/api/Category`)

  }


  getImageLikes(imageId:number,pageNb: number, pageSize:number ,userId:number) {
    console.log(userId)
    let params = new HttpParams()
      .set("id",imageId)
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())
      .set('userId',userId)

    return this.http.get<LikesModal[]>(`${environment.apiUrl}/api/Image/getImageLikes/`, {params});
  }

}
