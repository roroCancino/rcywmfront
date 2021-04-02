import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApiService } from '../url-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private headers = new HttpHeaders();
  constructor(
    public http: HttpClient,
    protected _urlApiService: UrlApiService
  ) { }

  public listarProductos(){

    const url = this._urlApiService.getUrlProductos();
    const mensaje = `{}`;

    return this.http.post(url, mensaje, { headers: this.headers });
  }

}
