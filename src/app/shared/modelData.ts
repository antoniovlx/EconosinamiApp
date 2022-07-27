import { Dre } from "src/entities/Dre";
import { Medios } from "src/entities/Medios";

export class sZAMIF {
    idZamif: number;
    zamif: string;
    superficieDet: number;
    perimEsc: number;
    superficieEsc: number;
    horasEsc: number;
    LR: sLR[] = [];
    HFT: sHFT = new sHFT();
    runHFT: sHFT[] = [new sHFT(),new sHFT(), new sHFT(), new sHFT(), new sHFT(), new sHFT()]; // FIL
    DCF: sDCF = new sDCF();
};

export class sDCFLR {
    // [2][6]; // pctl-FIL
    superficieEscXXpctl: number[][] = [[],[]];
};

export class sLR {
    IdLR: number;
    LR: string;
    pct: number;
    //double breakROS[6][5]; // [Fil][BreakROS]
    DCFLR: sDCFLR =  new sDCFLR();
    breakROS: number[] = [];
    //double runSize[2][6]; // Calculados pctl-FIL
    runSize: number[][] = [[],[]];
};

export class sHFT {
    //double area[6]; // Tamaño´
    area: number[] = [];
    //double numFuegos[6]; // Tamaño
    numFuegos: number[] = [];
    numFuegosTotal: number;
};

export class sDCF {
    //double numFuegos[6]; // FIL
    superficieEscXXpctl: number[][] = [[],[]];
    numFuegos: number[] = [];
    //double velPropMaxXXpctl[2][6]; // pctl-FIL
    velPropMaxXXpctl: number[][] = [[],[]];
};

export class sMRT {
    idMedio: Medios;
    idDRE: Dre;
    intensidadActivacion: number;
    tiempoLlegada: number;
  }

  
