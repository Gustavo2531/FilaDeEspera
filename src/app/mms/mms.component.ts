import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-mms',
  templateUrl: './mms.component.html',
  styleUrls: ['./mms.component.css']
})
export class MmsComponent implements OnInit {
  showFlashMessage = false;
  flashMessageSuccess = true;
  flashMessage = '';

  textLambda = '';
  textMu = '';
  textS= '';
  //csText = '';
  //cwText = '';

  csNumber = 0;
  cwNumber = 0;
  private numLambda: number;
  private numMu: number;
  private numS: number;
  n = 0;
  
  resultL = 0;
  resultLq = 0;
  resultW = 0;
  resultWq = 0;
  resultCt = 0;
  resultP0 = 0;
  resultRo = 0;


  onShowFlashMessage(text: string, success: boolean) {
    this.flashMessage = text;
    this.flashMessageSuccess = success;
    this.showFlashMessage = true;
  }

  constructor() {
  }

  ngOnInit() {
  }

  onSimulateRow() {
    const regDigits = /^\d+$/;
    if (parseFloat(this.textLambda)) {
      if (regDigits.test(this.textS.trim()) && parseInt(this.textS.trim(), 10) > 1) {
        if ( ( parseFloat(this.textMu) * parseInt(this.textS.trim(), 10))  > parseFloat(this.textLambda) ) {
         // if (parseFloat(this.csText) >= 0) {
           // if (parseFloat(this.cwText) >= 0) {
              this.numLambda = parseFloat(this.textLambda);
              this.numMu = parseFloat(this.textMu);
              this.numS = parseInt(this.textS.trim(), 10);
              //this.csNumber = parseFloat(this.csText);
              //this.cwNumber = parseFloat(this.cwText);
              this.simulateRow();
            //} else {
              //this.onShowFlashMessage('Cw debe ser un número mayor o igual a cero', false);
            //}
        //  } else {
            //this.onShowFlashMessage('Cs debe ser un número mayor o igual cero', false);
          //}
        } else {
          this.onShowFlashMessage('μ * s debe ser un número mayor a λ para que el sistema sea estable', false);
        }
      } else {
        this.onShowFlashMessage('s debe de ser un entero mayor a 1', false);
      }
    } else {
      this.onShowFlashMessage('λ debe ser un número mayor a 0.', false);
    }
  }

  simulateRow() {
    this.n = 0;
    this.resultL = 0;
    this.resultLq = 0;
    this.resultW = 0;
    this.resultWq = 0;
    this.resultP0 = 0;
    this.resultRo = 0;

    this.resultRo = (this.numLambda / (this.numS * this.numMu));
    let tempP0 = 0;
    for (this.n; this.n < this.numS; this.n++) {
      tempP0 += (((Math.pow(this.numLambda / this.numMu, this.n)) / (this.factorial(this.n))));
    }
    this.resultP0 = 1 / ((tempP0) + (((Math.pow(this.numLambda / this.numMu, this.numS)) / (this.factorial(this.numS)))) *
      (1 / (1 - this.resultRo )));
    const firstLq = this.resultRo * Math.pow(this.numLambda / this.numMu, this.numS) * this.resultP0;
    const secondLq = this.factorial(this.numS) * Math.pow((1 - this.resultRo), 2);
    this.resultLq = firstLq / secondLq;
    this.resultL = this.resultLq + (this.numLambda / this.numMu);
    this.resultWq = this.resultLq / this.numLambda;
    this.resultW = this.resultWq + (1 / this.numMu);

    //this.resultCt = (this.resultLq * this.cwNumber) + (this.numS * this.csNumber);

    
    this.resultL = Math.round(this.resultL * 10000) / 10000;
    this.resultLq = Math.round(this.resultLq * 10000) / 10000;
    this.resultW = Math.round(this.resultW * 10000) / 10000;
    this.resultWq = Math.round(this.resultWq * 10000) / 10000;
    this.resultP0 = Math.round(this.resultP0 * 10000) / 10000;
    this.resultRo = Math.round(this.resultRo * 10000) / 10000;

    //this.resultCt = Math.round(this.resultCt * 10000) / 10000;

    this.onShowFlashMessage('Medidas de desempeño y P0 calculadas con éxito', true);
  }

  factorial(num: number): number {
    if (num === 0) {
      return 1;
    }
    return num * this.factorial(num - 1);
  }
}
