import { Component, OnInit } from '@angular/core';
import { CarroService } from 'src/app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public _CarroService: CarroService
  ) { }

  ngOnInit(): void {
  }
  public tieneCarro(): boolean{
    return this._CarroService.getCarro().length > 0;
  }
}
