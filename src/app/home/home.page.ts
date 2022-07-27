import { trigger, transition, query, style, group, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { UiService } from '../services/ui.service';
import { UtilService } from '../services/util.service';
import { ZonasService } from '../zonas-analisis/components/zonas/services/zonas.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  public title: string;

  @ViewChild(IonContent, { static: false }) content: IonContent;

  zonasAnalisisCompleted: boolean = true;
  comportamientoFuegoCompleted: boolean = true;
  costesCompleted: boolean = true;

  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router, private util: UtilService, public uiService: UiService) { }

  ngOnInit() {
    this.title = this.router.url;

    this.uiService.getTopScrolled$().subscribe(scrolled => {
      this.content.scrollToTop();
    });
  }

  get base64Logo() {
    return this.util.getBase64Logo();
  }

  ionViewWillLeave() {

  }
}
