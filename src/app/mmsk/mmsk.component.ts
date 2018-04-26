import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-mmsk',
  templateUrl: './mmsk.component.html',
  styleUrls: ['./mmsk.component.css']
})
export class MmskComponent implements OnInit {
  showFlashMessage = false;
  flashMessageSuccess = true;
  flashMessage = '';

  textLambda = '';
  textMu = '';
  textS = '';
  textK = '';
  csText = '';
  cwText = '';

  csNumber = 0;
  cwNumber = 0;
  private numLambda: number;
  private numMu: number;
  private numS: number;
  private numK: number;
  resultP0 = 0;
  resultRo = 0;
  resultL = 0;
  resultLq = 0;
  resultW = 0;
  resultWq = 0;
  lambdaE = 0;
  resultCt = 0;

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
      if (regDigits.test(this.textK.trim()) && parseInt(this.textK.trim(), 10) > 0) {
        if (regDigits.test(this.textS.trim()) && parseInt(this.textS.trim(), 10) > 0
          && parseInt(this.textS.trim(), 10) < parseInt(this.textK.trim(), 10)) {
          if (( parseFloat(this.textMu) * parseInt(this.textS.trim(), 10)) > parseFloat(this.textLambda)) {
           if (parseFloat(this.csText) >= 0) {
              if (parseFloat(this.cwText) >= 0) {
                this.numLambda = parseFloat(this.textLambda);
                this.numMu = parseFloat(this.textMu);
                this.numS = parseInt(this.textS.trim(), 10);
                this.numK = parseInt(this.textK.trim(), 10);
                this.csNumber = parseFloat(this.csText);
                this.cwNumber = parseFloat(this.cwText);
              } else {
                this.onShowFlashMessage('Cw debe ser un número mayor o igual a cero', false);
              }
            } else {
              this.onShowFlashMessage('Cs debe ser un número mayor o igual cero', false);
            }
            this.simulateRow();
          } else {
            this.onShowFlashMessage('μ * s debe ser un número mayor a λ para que el sistema sea estable', false);
          }
        } else {
          this.onShowFlashMessage('El número de servidores debe de ser un entero mayor a 0 y menor a k.', false);
        }
      } else {
        this.onShowFlashMessage('El número de clientes debe de ser un entero mayor a 0.', false);
      }
    } else {
      this.onShowFlashMessage('λ debe ser un número mayor a 0.', false);
    }
  }

  simulateRow() {
    this.resultRo = 0;
    this.resultWq = 0;
    this.resultW = 0;
    this.resultLq = 0;
    this.resultL = 0;
    this.resultP0 = 0;
    this.lambdaE = 0;

    this.resultRo = (this.numLambda / (this.numS * this.numMu));
    let tempP01 = 0;
    for (let n = 0; n <= this.numS; n++) {
      tempP01 += (((Math.pow(this.numLambda / this.numMu, n)) / (this.factorial(n))));
    }
    let tempP02 = 0;
    for (let n = this.numS + 1; n <= this.numK; n++) {
      tempP02 += Math.pow(this.resultRo, (n - this.numS));
    }
    this.resultP0 = 1 / (tempP01 + (((Math.pow(this.numLambda / this.numMu, this.numS)) / this.factorial(this.numS)) * tempP02));
    const firstLq = this.resultP0 * Math.pow(this.numLambda / this.numMu, this.numS) * this.resultRo;
    const secondLq = this.factorial(this.numS) * Math.pow(1 - this.resultRo, 2);
    const thirdLq = 1 - Math.pow(this.resultRo, (this.numK - this.numS)) - (this.numK - this.numS) *
      Math.pow(this.resultRo, (this.numK - this.numS)) * (1 - this.resultRo);
    this.resultLq = (firstLq / secondLq) * thirdLq;

    this.lambdaE = this.numLambda * (1 - this.obtainPn(this.resultP0, this.numLambda, this.numMu, this.numS, this.numK));
    this.resultWq = this.resultLq / this.lambdaE;
    this.resultW = this.resultWq + (1 / this.numMu);
    this.resultL = this.lambdaE * this.resultW;

    this.resultCt = (this.resultLq * this.cwNumber) + (this.numS * this.csNumber);


    this.resultL = Math.round(this.resultL * 10000) / 10000;
    this.resultLq = Math.round(this.resultLq * 10000) / 10000;
    this.resultW = Math.round(this.resultW * 10000) / 10000;
    this.resultWq = Math.round(this.resultWq * 10000) / 10000;
    this.resultP0 = Math.round(this.resultP0 * 10000) / 10000;
    this.resultRo = Math.round(this.resultRo * 10000) / 10000;

    this.resultCt = Math.round(this.resultCt * 10000) / 10000;

    this.onShowFlashMessage('Medidas de desempeño y P0 calculadas con éxito', true);
  }

  factorial(num: number): number {
    if (num === 0) {
      return 1;
    }
    return num * this.factorial(num - 1);
  }

  obtainPn(p0: number, l: number, mu: number, s: number, n: number): number {
    if (n <= s) {
      const first = Math.pow(l / mu, n);
      const second = this.factorial(n);
      return (first / second) * p0;
    } else {
      const first = Math.pow(l / mu, n);
      const second = this.factorial(s) * Math.pow(s, n - s);
      return (first / second) * p0;
    }
  }

}
