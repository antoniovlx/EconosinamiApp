import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonMenu, Platform, IonRouterOutlet } from '@ionic/angular';
import { OrmService } from './services/orm.service';
import { SQLiteService } from './services/sqlite.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from './services/util.service';
import { appPages } from './app-routing.module';
import { UiService } from './services/ui.service';
import { Location } from '@angular/common';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('sidebar')
  sidebar: IonMenu;

  public labels = [];
  @ViewChild(IonContent, { static: false }) content: IonContent;


  constructor(
    private platform: Platform,
    private ormService: OrmService,
    private sqlite: SQLiteService,
    public translate: TranslateService,
    private uiService: UiService,
    private util: UtilService,
    private location: Location
  ) {

    const lang = localStorage.getItem('lang');
    if(lang !== null){
      localStorage.setItem('lang', lang);
      translate.setDefaultLang(lang);
    }else{
      translate.setDefaultLang('es');
      localStorage.setItem('lang', 'es');
    }

    this.initializeApp();
  }

  ngOnInit() {
    this.util.getConfiguracion();
  }

  ngAfterViewInit() {

  }

  initializeApp() {
    this.platform.ready().then(async () => {
      await this.ormService.initialize();
    });
  }

  openHelp() {

  }

  get appPages() {
    return appPages;
  }

  get base64Logo() {
    return this.util.getBase64Logo();
  }


  @HostListener('window:beforeunload', ['$event'])
  onLoadHandler(event: Event) {
    /*let result = confirm("Changes you made may not be saved.");
    if (result) {
      // Do more processing...
      window.opener.location.reload();
    }
    event.returnValue = false;*/
  }

  async testDB() {
    try {
      console.log(`going to create a connection`);
      const db = await this.sqlite.createConnection('db_issue', false, 'no-encryption', 1);
      console.log(`db ${JSON.stringify(db)}`);
      await db.open();
      console.log(`after db.open`);
      const query = `
      CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
      );
      `;
      console.log(`query ${query}`);

      const res: any = await db.execute(query);
      console.log(`res: ${JSON.stringify(res)}`);
      await this.sqlite.closeConnection('db_issue');
      console.log(`after closeConnection`);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  scrollToTop() {
    this.uiService.scrollTop$(true);
  }

  @HostListener('window:scroll') onScroll(e: Event): void {
    console.log(this.getYPosition(e));
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  changeLang(lang: string){
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
