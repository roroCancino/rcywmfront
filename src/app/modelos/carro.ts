import { Producto } from "./producto";

export class PrdEnCarro {
  producto: Producto = new Producto();
  id_usr?: string;
  cantidad: number = 0;
}
