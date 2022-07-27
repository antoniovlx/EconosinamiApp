import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AppService, ContainerItem, IDataContainer } from 'src/app/services/app.service';
import { UiService } from 'src/app/services/ui.service';
import { TableClass } from 'src/app/shared/tableClass';
import { GruposDcf } from 'src/entities/GruposDcf';
import { Zamif } from 'src/entities/Zamif';
import { ZonasService } from '../../../zonas/services/zonas.service';
import { ComportamientoDataComponent } from '../comportamiento-data/comportamiento-data.component';

@Component({
  selector: 'grupos-comportamiento',
  templateUrl: './grupos-comportamiento.component.html',
  styleUrls: ['./grupos-comportamiento.component.scss'],
})
export class GruposComportamientoComponent extends TableClass implements OnInit, AfterViewInit, IDataContainer {
  @Input()
  data: any;

  gruposDfcList: GruposDcf[];
  zamifList: Zamif[];
  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];

  @ViewChild(MatTable) table: MatTable<Zamif>;

  constructor(private appservice: AppService, private zonasService: ZonasService, 
    private uiService: UiService, private translate: TranslateService) {
    super();
  }

  ngAfterViewInit(): void {
    this.refreshData();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<GruposDcf[]>([]);
    this.appservice.setActionButtonsChanged$([]);
  }

  refreshData() {
    this.zonasService.getGdcfList().subscribe((items) => {
      this.gruposDfcList = items;
      this.dataSource.data = this.gruposDfcList;
      this.elements = items.length;
      this.table.renderRows();
      this.isLoading = false;
    });
  }

  async open(element?: GruposDcf) {
    const message = await this.checkExistingData();
    // comprobar información obligatoria
    if(message === null){
      let gdcf = element !== undefined ? element : new GruposDcf(this.lastId() + 1);
      this.appservice.loadComponent(new ContainerItem(ComportamientoDataComponent, {
        gdcf: gdcf,
        zamifList: this.zamifList,
        titleComponent: "Comportamiento del fuego en los ZAMIF",
        isMainComponent: false,
        helpText: 'gdcfDataHelpText'
      }), this.appservice.getRefCurrentDynamicComponent())
    }else{
      await this.uiService.avisoAlert("Aviso", message);
    }
  }

  async checkExistingData() {
    let datos = [];
    // Debe existir algún Zamif
    this.zonasService.getZamifList();
    const items = await firstValueFrom(this.zonasService.getZamifLoaded$());
    this.zamifList = items;

    if (this.zamifList.length === 0) {
      datos.push("Zonas de análisis");
    } else {
      const message = await firstValueFrom(this.translate.get("lugares representativos en el Zamif"))
      for (let index = 0; index < this.zamifList.length; index++) {
        const zamif = this.zamifList[index];
        if (zamif.lrs.length === 0) {
          datos.push(message + ": (" + zamif.zamif + ") " + zamif.descripcion);
        }
      }
    }

    if (datos.length === 0) {
      return null
    }

    return this.uiService.createMessageAviso(datos);
  }

  lastId() {
    if (this.gruposDfcList.length !== 0) {
      let length = this.gruposDfcList.length;
      return this.gruposDfcList[length - 1].idGdcf + 1;
    }
    return 1;
  }

  async delete() {
    let continuar = true;

    const confirm = await this.uiService.confirmationAlert("Confirmación",
      "¿Desea CONTINUAR y eliminar los elementos seleccionados?");

    if (confirm) {
      continuar = true;
    } else {
      continuar = false;
    }

    if (continuar) {
      const selectedLen = this.selection.selected.length;
      let count = 0;
      this.selection.selected.forEach(element => {
        this.zonasService.deleteGdcf(element).subscribe(result => {
          count++;
          if (count === selectedLen) {
            this.uiService.presentToast("Mensaje borrado");
            this.refreshData();
          }
        });
      });
    }
  }
}

