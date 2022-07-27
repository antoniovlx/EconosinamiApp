import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { sZAMIF } from 'src/app/shared/modelData';
import { Zamif } from 'src/entities/Zamif';

@Component({
  selector: 'fuegos-intensidad',
  templateUrl: './fuegos-intensidad.component.html',
  styleUrls: ['./fuegos-intensidad.component.scss'],
})
export class FuegosIntensidadComponent implements OnInit {
  displayedColumns: string[] = ['intensidad', 'tamano1', 'tamano2', 'tamano3', 'tamano4'
  , 'tamano5', 'tamano6', 'total'];
idZamifSelected: number;

tamanos = ['<0.1', '0.1 - 3.99', '4-39.99', '40-119.99', '120 - 399.99', '>= 400']

@Input()
zamif: Zamif;

@Input()
sZamif: sZAMIF;

@Input()
dataSourceHectareasQuemadas: MatTableDataSource<any>;

@Input()
dataSourceNumeroFuegos: MatTableDataSource<any>;


  constructor() { }

  ngOnInit() {}

}
