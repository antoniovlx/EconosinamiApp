import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'button-actions',
  templateUrl: './button-actions.component.html',
  styleUrls: ['./button-actions.component.scss'],
})
export class ButtonActionsComponent implements OnInit {
  @Input()
  noToolbar: boolean = false; 

  buttons = [];
  refComponent: any;
  aviso: any;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.aviso = undefined;
    this.appService.getActionButtonsChanged$().subscribe(data =>{
      this.refComponent = data.refComponent
      this.buttons = data.buttons;
    })

    this.appService.getAvisoChanged$().subscribe(aviso =>{
      this.aviso = aviso;
    })
  }

  action(action){
    this.refComponent[action]();
  }

}
