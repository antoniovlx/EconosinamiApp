import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'subtitulo-ventana',
  templateUrl: './subtitulo-ventana.component.html',
  styleUrls: ['./subtitulo-ventana.component.scss'],
})
export class SubtituloVentanaComponent implements OnInit, AfterViewInit {

  isMainComponent: boolean;
  currentTitleComponent: string;

  @Input()
  disabled: boolean;
  helpText: string;

  constructor(private appService: AppService, private uiService: UiService, private translate: TranslateService) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.appService.getTitleComponentChanged$().subscribe(data => {
      this.currentTitleComponent = data.titleComponent;
      this.isMainComponent = data.isMainComponent;
      this.helpText = data.helpText;
    });
  }

  goPrev() {
    this.appService.goPrev({ back: true });
  }

  async help() {
    this.translate.get(this.helpText).subscribe(async text =>{
      await this.uiService.avisoAlert("Ayuda", text);
    })
  }
}
