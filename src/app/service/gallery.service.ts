import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Gallery} from "../models/gallery";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private http:HttpClient){

  }

  getGalleryById(galleryId:number){
    return this.http.get<Gallery>(`${environment.apiUrl}/api/Gallery/${galleryId}`)
  }

  updateGallery(gallery:Gallery): Observable<any> {
    console.log("ajung")
    return this.http.put<any>(`${environment.apiUrl}/api/Gallery/update`, gallery);
  }

  createGallery(gallery:Gallery):Observable<any>{
    console.log("post")
    return this.http.post<any>(`${environment.apiUrl}/api/Gallery/create`, gallery);

  }

}
