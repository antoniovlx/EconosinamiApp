import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediosService } from 'src/app/medios-combate/services/medios.service';
import { UtilService } from 'src/app/services/util.service';
import { Medios } from 'src/entities/Medios';

@Component({
  selector: 'recursos-medio',
  templateUrl: './recursos-medio.component.html',
  styleUrls: ['./recursos-medio.component.scss'],
})
export class RecursosMedioComponent implements OnInit {

  @Input()
  medio: Medios;


  @Output() medioChanged = new EventEmitter<Medios>();

  constructor(private mediosService: MediosService, public util: UtilService) { }

  ngOnInit() {
    this.mediosService.getMediosChanged$().asObservable().subscribe(medio => {
      this.medio = medio;
    })
  }

  changeMedio() {
    this.medioChanged.emit(this.medio);
  }
}
