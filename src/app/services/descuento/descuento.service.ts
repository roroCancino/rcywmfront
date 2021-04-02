import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApiService } from '../url-api.service';

@Injectable({
  providedIn: 'root'
})
export class DescuentoService {
  private headers = new HttpHeaders();

  constructor(public http: HttpClient,
    protected _urlApiService: UrlApiService) { }

  public listarDescuentos(){

    const url = this._urlApiService.getUrlDescuentos();
    const mensaje = `{}`;

    return this.http.post(url, mensaje, { headers: this.headers });
  }
}
