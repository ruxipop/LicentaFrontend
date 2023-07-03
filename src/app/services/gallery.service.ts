import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Gallery} from "../models/gallery";
import {Observable} from "rxjs";
import {Modal} from "../models/modal";
import {Picture} from "../models/picture";

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private http: HttpClient) {

  }

  getGalleryById(galleryId: number) {
    return this.http.get<Gallery>(`${environment.apiUrl}/api/Gallery/${galleryId}`)
  }

  getAllGalleries(userId: number, pageNb: number, pageSize: number, searchTerm: string) {
    let params = new HttpParams()
      .set('userId', userId)
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())
    if (searchTerm != ' ') {
      params = params.set("searchTerm", searchTerm)
    }

    return this.http.get<Gallery[]>(`${environment.apiUrl}/api/Gallery/allGalleries/`, {params});
  }

  updateGallery(gallery: Gallery): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/Gallery/update`, gallery);
  }

  createGallery(gallery: Gallery): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Gallery/create`, gallery);

  }

  addPhotoToGallery(photo: Picture, gallery: Gallery) {
    let body = {
      "image": photo,
      "gallery": gallery
    }
    return this.http.post<any>(`${environment.apiUrl}/api/Gallery/addPhoto`, body);

  }

  removePhotoFromGallery(photo: Picture, gallery: Gallery) {
    let body = {
      "image": photo,
      "gallery": gallery
    }
    return this.http.post<any>(`${environment.apiUrl}/api/Gallery/removePhoto`, body);
  }

  deleteGallery(galleryId: number) {
    return this.http.delete(`${environment.apiUrl}/api/Gallery/` + galleryId)
  }

}
