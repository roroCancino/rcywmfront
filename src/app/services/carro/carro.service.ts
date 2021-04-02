import { Injectable } from '@angular/core';
import { Descuento, PrdEnCarro, Producto, Respuesta, SubTotMarca } from 'src/app/modelos/';

@Injectable({
  providedIn: 'root'
})
export class CarroService {
  //PRM descuentos
  private prmDesc: Descuento[] = [];

  //Carro con todos los productos
  private carro: PrdEnCarro[] = [];

  //Areglo Marcas
  private arrlMarcaAll: SubTotMarca[] = [];
  //Areglo Marcas con descuento
  private arrlMarcaDesc: SubTotMarca[] = [];
  //Areglo Marcas sin descuento
  private arrlMarcaSinDesc: SubTotMarca[] = [];

  //Sub Total calculado sin descuento
  private subTotal: number = 0;
  private subTotalDesc: number = 0;
  private total: number = 0;
  constructor() { }

  //Agrega producto al carro
  public addCarro(prod: Producto, idUsr: string): void {
    let prdEnCarro: PrdEnCarro = new PrdEnCarro();
    prdEnCarro.producto = prod;
    prdEnCarro.id_usr = idUsr;
    //Si producto no existe lo agrega al carro y suma el precio al subtotal
    if (this.carro.findIndex(el => el.producto.id === prod.id) === -1) {
      prdEnCarro.cantidad = 1;
      this.carro.push(prdEnCarro);
    }
    else {
      const i: number = this.carro.findIndex(el => el.producto.id === prod.id);
      this.carro[i].cantidad = this.carro[i].cantidad + 1;
    }
    //Calcula Sub Total
    this.subTotal += prdEnCarro.producto.price;
    //Add arr Marcas (ambos)
    this.addArrMArcas(prod);
  }
  // Elimina producto del carro
  public delCarro(prod: Producto, idUsr: string) {

    //Si existe el producto en el carro
    if (this.carro.findIndex(el => el.producto.id === prod.id) > -1) {
      const i: number = this.carro.findIndex(el => el.producto.id === prod.id);
      const cant: number = this.carro[i].cantidad;
      //Si la cantidad de productos en el carro es > 1, se le resta uno
      if (cant > 1) {
        this.carro[i].cantidad = this.carro[i].cantidad - 1;

      }
      //sino, lo elimina del carro
      else {
        this.carro.splice(i, 1);
      }
    }
    //Calcula en línea el subtotal por marca
    this.subTotal -= prod.price;
    //Elimina marca de arreglod
    this.delArrMArcas(prod);

  }

  //Agrega arreglo de marcas con subtatales y descuentos
  private addArrMArcas(prod: Producto): void {
    console.log('addArrMArcas');
    const valDesc: Descuento = this.getDescuentoMarca(prod.brand);
    const it: number = this.arrlMarcaAll.findIndex(el => el.marca === prod.brand);
    console.log('it');
    console.log(it);
    //Si existe en el arreglo general, actualiza el sub total, sino, lo agrega
    if (it > -1) {
      this.arrlMarcaAll[it].subTotal += prod.price;
    }
    else {
      let auxT: SubTotMarca = new SubTotMarca();
      auxT.marca = prod.brand;
      auxT.subTotal = prod.price;
      auxT.mtoParaDesc = valDesc.threshold;
      auxT.descuento = valDesc.discount;
      this.arrlMarcaAll.push(auxT)
    }

    const i2: number = this.arrlMarcaAll.findIndex(el => el.marca === prod.brand);
    //Ya que ahora existe en el arreglo general, definimos, si tiene o no descuento
    if (i2 > -1) {
      //Si el subtotal de la marca es >= a el monto para descuento
      if (this.arrlMarcaAll[i2].subTotal >= this.arrlMarcaAll[i2].mtoParaDesc) {
        //Preguntamos si existe en con desc
        const iConD: number = this.arrlMarcaDesc.findIndex(el => el.marca === prod.brand);
        if (iConD > -1) {
          // Si exite, actualizamos subtotal
          this.arrlMarcaDesc[iConD].subTotal = this.arrlMarcaAll[i2].subTotal;
        }
        else {
          //sino, agregamos
          //Eliminamos de "Sin desc"
          const iSinD: number = this.arrlMarcaSinDesc.findIndex(el => el.marca === prod.brand);
          this.arrlMarcaSinDesc.splice(iSinD, 1);

          this.arrlMarcaDesc.push(this.arrlMarcaAll[i2]);
        }

      }
      else {
        const iConD: number = this.arrlMarcaSinDesc.findIndex(el => el.marca === prod.brand);
        if (iConD > -1) {
          // Si exite, actualizamos subtotal
          this.arrlMarcaSinDesc[iConD].subTotal = this.arrlMarcaAll[i2].subTotal;
        }
        else{
          this.arrlMarcaSinDesc.push(this.arrlMarcaAll[i2]);
        }
      }
    }
  }

  //Elimina arreglo de marcas con subtatales y descuentos
  private delArrMArcas(prod: Producto): void {
    const valDesc: Descuento = this.getDescuentoMarca(prod.brand);

    const it: number = this.arrlMarcaAll.findIndex(el => el.marca === prod.brand);
    //Si existe en el arreglo general, actualiza el sub total
    if (it > -1) {
      this.arrlMarcaAll[it].subTotal -= prod.price;
      // Si el subtotal = 0 lo elimina de todos lados
      if (this.arrlMarcaAll[it].subTotal === 0) {
        const icd: number = this.arrlMarcaDesc.findIndex(el => el.marca === prod.brand);
        this.arrlMarcaDesc.splice(icd, 1);

        const isd: number = this.arrlMarcaSinDesc.findIndex(el => el.marca === prod.brand);
        this.arrlMarcaSinDesc.splice(isd, 1);

        this.arrlMarcaAll.splice(it, 1);
      }
    }
    const i2: number = this.arrlMarcaAll.findIndex(el => el.marca === prod.brand);
    //Si aun existe en el arreglo general, definimos, si tiene o no descuento
    if (i2 > -1) {
      if (this.arrlMarcaAll[i2].subTotal >= this.arrlMarcaAll[i2].mtoParaDesc) {
        //Preguntamos si existe en con desc
        const iConD: number = this.arrlMarcaDesc.findIndex(el => el.marca === prod.brand);
        if (iConD > -1) {
          // Si exite, actualizamos subtotal
          this.arrlMarcaDesc[iConD].subTotal = this.arrlMarcaAll[i2].subTotal;
        }
        else {
          //sino, agregamos
          //Eliminamos de "Sin desc"
          const iSinD: number = this.arrlMarcaSinDesc.findIndex(el => el.marca === prod.brand);
          this.arrlMarcaSinDesc.splice(iSinD, 1);

          this.arrlMarcaDesc.push(this.arrlMarcaAll[i2]);
        }

      }
      else {
        const iConD: number = this.arrlMarcaSinDesc.findIndex(el => el.marca === prod.brand);
        if (iConD > -1) {
          // Si exite, actualizamos subtotal
          this.arrlMarcaSinDesc[iConD].subTotal = this.arrlMarcaAll[i2].subTotal;
        }
        else{
          const iaux: number = this.arrlMarcaDesc.findIndex(el => el.marca === prod.brand);
          this.arrlMarcaDesc.splice(iaux, 1);

          this.arrlMarcaSinDesc.push(this.arrlMarcaAll[i2]);
        }
      }
      // if (this.arrlMarcaAll[i2].subTotal >= this.arrlMarcaAll[i2].mtoParaDesc) {
      //   this.arrlMarcaDesc.push(this.arrlMarcaAll[i2]);
      // }
      // else {
      //   this.arrlMarcaSinDesc.push(this.arrlMarcaAll[i2]);
      // }
    }

    console.log('TODOS');
    console.log(this.arrlMarcaAll);
    console.log('CON DESC');
    console.log(this.arrlMarcaDesc);
    console.log('SIN DESC');
    console.log(this.arrlMarcaSinDesc);
  }

  //Set del total de descuentos
  public setDescuentos(descuentos: Descuento[]): void {
    this.prmDesc = descuentos;
  }

  private getDescuentoMarca(marca: string): Descuento {
    const i: number = this.prmDesc.findIndex(el => el.brand === marca);
    return this.prmDesc[i];
  }

  //Retorna la cantodad de un producto en el carro
  public cantidadEnCarro(prod: Producto, idUsr: string): number {
    //Si existe el producto en el carro retorna la cantidad
    if (this.carro.findIndex(el => el.producto.id === prod.id) > -1) {
      const i: number = this.carro.findIndex(el => el.producto.id === prod.id);
      return this.carro[i].cantidad;
    }
    return 0;
  }
  //Limpia el carro
  public clearCarro(): void {
    this.carro = [];
  }
  //Retorna el carro
  public getCarro(): PrdEnCarro[] {
    return this.carro;
  }
  //Retorna el subtotal sin descuentos aplicados.
  public getSubTotal(): number {
    return this.subTotal;
  }
  //Retorna el Total Marcas.
  public getTotalMarcas(): SubTotMarca[] {
    return this.arrlMarcaAll;
  }
  //Retorna el Total Marcas con descuento.
  public getTotalMarcasConDesc(): SubTotMarca[] {
    return this.arrlMarcaDesc;
  }

  //Retorna el Total Marcas sin descuento.
  public getTotalMarcasSinDesc(): SubTotMarca[] {
    return this.arrlMarcaSinDesc;
  }

  public getTotalDesc(): number{
    let sum: number = 0;
    this.arrlMarcaDesc.forEach(el => {
      sum += el.descuento;
    });
    return sum;
  }
}




