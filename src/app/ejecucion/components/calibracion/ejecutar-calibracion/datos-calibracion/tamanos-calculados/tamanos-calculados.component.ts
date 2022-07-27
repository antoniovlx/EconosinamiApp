import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { get, uniqWith } from 'lodash';
import { UtilService } from 'src/app/services/util.service';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Zamif } from 'src/entities/Zamif';

@Component({
  selector: 'tamanos-calculados',
  templateUrl: './tamanos-calculados.component.html',
  styleUrls: ['./tamanos-calculados.component.scss'],
})
export class TamanosCalculadosComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['intensidad', 'numerofuegos', 'velocidad50perc', 'tamano50perc', 'frec50perc'
    , 'velocidad90perc', 'tamano90perc', 'frec90perc', 'lr'];

  /*@Input()
  dcfAll: Dcf[] = [];

  @Input()
  dcflrAll: Dcflr[] = [];*/

  @Input()
  dataSource: MatTableDataSource<any>;

  @Input()
  zamif: Zamif;

  @Input()
  gdcf: GruposDcf;

  total: number;

  aviso: boolean;

  spans = {};

  constructor(private utilService: UtilService) { }

  ngOnInit() {
   
  }

  ngAfterViewInit(): void {
    this.spans = Object.assign({}, {
      intensidad: this.spanDeep(['intensidad'], this.dataSource.data),
      numeroFuegos: this.spanDeep(['intensidad', 'numerofuegos'], this.dataSource.data),
      velocidad50perc: this.spanDeep(['intensidad', 'numerofuegos', 'velocidad50perc', 'velocidad90perc'], this.dataSource.data),
      velocidad90perc: this.spanDeep(['intensidad', 'numerofuegos', 'velocidad50perc', 'velocidad90perc'], this.dataSource.data)
    });
  }

  spanDeep(paths: string[] | null, data: any[]) {
    if (!paths.length) {
      return [...data]
        .fill(0)
        .fill(data.length, 0, 1);
    }

    const copyPaths = [...paths];
    const path = copyPaths.shift();

    const uniq = uniqWith(data, (a, b) => get(a, path) === get(b, path))
      .map(item => get(item, path));

    return uniq
      .map(uniqItem => this.spanDeep(copyPaths, data.filter(item => uniqItem === get(item, path))))
      .flat(paths.length);
  }

  getRowSpan(path, idx) {
    if (!this.utilService.isObjectEmpty(this.spans)) {
      return this.spans[path][idx];
    } else {
      return 1;
    }
  }
}


