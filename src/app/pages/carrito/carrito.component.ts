import { Component, OnInit } from '@angular/core';
import { PrdEnCarro, SubTotMarca } from 'src/app/modelos';
import { CarroService } from 'src/app/services';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  public _PrdEnCarro: PrdEnCarro[] = [];

  constructor(
    public _CarroService: CarroService
  ) { }

  ngOnInit(): void {
    this._PrdEnCarro = this._CarroService.getCarro();
  }
  public calculaSubTotal(): number{
    return this._CarroService.getSubTotal();
  }
  public calculaDescuento(): number{
    return this._CarroService.getTotalDesc();
  }
  public calculaTotal(): number{
    return this._CarroService.getSubTotal() - this.calculaDescuento();
  }
  public getSinDesc(): SubTotMarca[]{
    return this._CarroService.getTotalMarcasSinDesc()
  }
  public getConDesc(): SubTotMarca[]{
    return this._CarroService.getTotalMarcasConDesc()
  }

}
