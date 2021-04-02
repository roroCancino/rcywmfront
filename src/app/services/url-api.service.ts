import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlApiService {

  constructor() { }

  public getUrlProductos(): string{
    return `${environment.urlApi}/productos`;
  }
  public getUrlDescuentos(): string{
    return `${environment.urlApi}/discount`;
  }

}
