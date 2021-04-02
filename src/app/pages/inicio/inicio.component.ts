import { Component, OnInit } from '@angular/core';
import { Respuesta } from 'src/app/modelos';
import { Producto } from 'src/app/modelos/producto';
import { CarroService, ProductoService, DescuentoService } from 'src/app/services';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public productos: Producto[] = [];

  constructor(
    public _productoService: ProductoService,
    public _CarroService: CarroService,
    public _descuentoService: DescuentoService
    ) { }

  ngOnInit(): void {
    this.llenaProductos();
    this.llenaDescuentos();
    this._CarroService.clearCarro();
  }

  protected llenaProductos(): void {
    this._productoService.listarProductos().subscribe((resp: Respuesta) => {
      this.productos = resp.data;
    });
  }

  protected llenaDescuentos(): void {
    this._descuentoService.listarDescuentos().subscribe((resp: Respuesta) => {
      this._CarroService.setDescuentos(resp.data);
    });
  }




  public addCarro(prod: Producto): void{
    this._CarroService.addCarro(prod,'1');
    // console.log(this._CarroService.getCarro());
  }

  public delCarro(prod: Producto): void{
    this._CarroService.delCarro(prod,'1');
    // console.log(this._CarroService.getCarro());
  }

  public cantidadEnCarro(prod: Producto): number{
    return this._CarroService.cantidadEnCarro(prod,'1');
  }

}
