import { GrupoCnvr } from "src/entities/GrupoCnvr";
import { GruposDcf } from "src/entities/GruposDcf";
import { Lr } from "src/entities/Lr";
import { Medios } from "src/entities/Medios";
import { Opciones } from "src/entities/Opciones";
import { Zamif } from "src/entities/Zamif";

export const getFileName = (name: string) => {
    let timeSpan = new Date().toISOString();
    let sheetName = name || "ExportResult";
    let fileName = `${sheetName}-${timeSpan}`;
    return {
      sheetName,
      fileName
    };
  };
  
  
  
  export enum eDocument {
    ePDF,
    eHTML,
    eEXCEL,
    eTXT
  };
  
  export enum eOrden {
    eOpcion,
    ePresupuesto,
    eTotal,
    eSuperficie
  };
  
  export enum eTipo {
    eAcumlados,
    ePromedios
  };
  
  export class SPresupuestos {
    idOpcion: number;
    opcion: string;
    descripcion: string;
    presupuesto: number;
    cnvr: number;
    costo: number;
    superficie: number;
    numSimulaciones: number;
    numEscapados: number;
    total: number;
  
  }
  
  export class DataIntensidad {
    zamif: Zamif;
    opciones: OpcionData[] = [];
    grupo: GruposDcf;
  }
  
  export class DataIntensidadesActivacion {
    medio: Medios;
    data: DataIntensidadesActivacionLr[] = [];
  }
  
  export class DataIntensidadesActivacionLr {
    constructor(lr: Lr, intensidad: number) {
      this.lr = lr;
      this.intensidad = intensidad;
    }
  
    lr: Lr;
    intensidad: number;
  }
  
  
  export class OpcionData {
    opcion: Opciones;
  
    // Resumen según Niveles de Intensidad y Tamaño Final del Fuego
  
    dataNivelTamanoFuego: DataNivelTamanoFuego[] = [];
    // Estimación de las Hectáreas Quemadas Anualmente según Niveles de Intensidad y Tamaño Final del Fuego
    dataEstimacionHectareas: DataEstimacionHectareas;
  
    // Estimación del Número de Fuegos Anuales según Niveles de Intensidad y Tamaño Final del Fuego
    dataEstimacionFuegosAnuales: DataEstimacionHectareas;
  
    // Resumen de Fuegos Anuales y Cambio en el Valor Neto, por Lugares Representativos
    dataResumenFuegosAnuales: DataResumenFuegosAnuales = new DataResumenFuegosAnuales();
  
    // Intensidades de Activación de Medios por Lugares Representativos
    dataIntensidadesActivacionLr: DataIntensidadesActivacion[] = [];
  
  };
  
  export class DataNivelTamanoFuego {
    lr: string;
    intensidad: number;
    percentil: number;
    frecuencia: number;
    status: string;
    area: number;
    perimetro: number;
    costo: number;
    cnvr: number;
    velocidad: number;
    numeroFuegos: number;
  }
  
  export class DataIntensidadHectareas {
    intensidad: number;
    tamanos: number[] = [0, 0, 0, 0, 0, 0]; // 6 intensidades
    totalIntensidad: number = 0;
  }
  
  export class DataEstimacionHectareas {
    totalSize: number[] = [0, 0, 0, 0, 0, 0, 0];
    historico: number[] = [];
    porcentaje: number[] = [0, 0, 0, 0, 0, 0, 0];
    porcentajeAcum: number[] = [0, 0, 0, 0, 0, 0, 0];
    dataIntensidad: DataIntensidadHectareas[] = [];
  }
  
  export class DataEstimacionFuegoAnuales {
    zamif: Zamif;
    opciones: OpcionData[];
    grupo: GruposDcf;
  }
  
  
  export class DataResumenFuegosAnuales {
    data: DataResumenFuegosLr[] = [];
    total: number[] = [];
  }
  
  export class DataResumenFuegosLr {
    lr: Lr;
    frecuencia: number;
    area: number;
    costo: number;
    cnvr: number;
    total: number;
  }
  
  
  export class DataCnvr {
    grupos: DataGrupoCnvr[] = [];
  }
  
  export class DataGrupoCnvr {
    grupo: GrupoCnvr;
    lugares: Lr[] = [];
    intensidadesData: IntensidadesData[] = [];
    total: number[] = [0, 0, 0, 0, 0, 0];
  }
  
  export class DataTablaMaestra {
    lugares: Lr[] = [];
    data: DataMedioLr[] = [];
  }
  
  export class DataMedioLr {
    medio: Medios;
    medioData: DataMedio[] = [];
  };
  
  export class DataMedio {
    rendimiento: number; tiempoLlegada: number; costoUnitarioPorMision: number;
  };

  export class IntensidadesData {

    constructor(recurso, intensidad1, intensidad2, intensidad3, intensidad4, intensidad5, intensidad6) {
      this.recurso = recurso;
      this.intensidad1 = intensidad1;
      this.intensidad2 = intensidad2;
      this.intensidad3 = intensidad3;
      this.intensidad4 = intensidad4;
      this.intensidad5 = intensidad5;
      this.intensidad6 = intensidad6;
    }
    recurso?: number;
    intensidad1?: number;
    intensidad2?: number;
    intensidad3?: number;
    intensidad4?: number;
    intensidad5?: number;
    intensidad6?: number;
  }
  
  export class DataEscapados {
    lugar: Lr;
    percentil: number;
    intensidad1: number;
    intensidad2: number;
    intensidad3: number;
    intensidad4: number;
    intensidad5: number;
    intensidad6: number;
  }
  
  export class DataTemplate {
    opcionesEjecucion: Opciones[];
    gruposComportamientoFuego: GruposDcf[];
    dataCategoriaMedios: { idCategoriaMedios: number, codDesc: string, presupuesto: number[], cantidad: number[] }[];
    selectedOpciones: Opciones[];
    selectedGrupos: GruposDcf[];
    selectedZamif: Zamif[];
    selectedTables: { id: number, checked: boolean }[];
    tipoResultado: number;
    tipoDocumento: number;
    ordenarPor: number;
  }