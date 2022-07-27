import { AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';

import { AppService, ContainerItem } from 'src/app/services/app.service';
import { DynamicDirective } from 'src/app/shared/directives/dynamic.directive';

@Component({
  selector: 'container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements AfterViewInit {
  @ViewChild(DynamicDirective, { static: true }) 
  dynamicComponent!: DynamicDirective;

  @Input()
  noToolbar: boolean = false;
  
  data: any;
  isMainComponent: boolean;
  currentTitleComponent: string;
  
  constructor(private appService: AppService) {
  }

  ngAfterViewInit(): void {
    this.appService.getTitleComponentChanged$().subscribe(data => {
      this.currentTitleComponent = data.titleComponent;
      this.isMainComponent = data.isMainComponent;
    });

  }
  loadComponent(item: ContainerItem){
    this.appService.setRefCurrentDynamicComponent(this.dynamicComponent);
    this.appService.loadComponent(item, this.dynamicComponent);
  }



}
