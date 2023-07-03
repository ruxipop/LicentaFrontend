import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {SecuritySettingsService} from "./security-settings.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private http: HttpClient,
              private settings: SecuritySettingsService) {
  }

  addLikeToImage(imageId: number) {
    let params = new HttpParams();
    params = params.set("imageId", imageId);
    return this.http.post(`${environment.apiUrl}/api/Like`, {},
      {
        params: params
      });
  }

  removeLike(imageId: number) {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('imageId', imageId);

    return this.http.delete(`${environment.apiUrl}/api/Like`,
      {
        headers: this.settings.getHeaders(),
        params: queryParams
      });
  }


}
