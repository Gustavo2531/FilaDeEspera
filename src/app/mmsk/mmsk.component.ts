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

  lamdaText = '';
  muText = '';
  sText = '';
  kText = '';
  csText = '';
  cwText = '';

  csNumber = 0;
  cwNumber = 0;
  private lamdaNumber: number;
  private muNumber: number;
  private sNumber: number;
  private kNumber: number;
  resultP0 = 0;
  resultRo = 0;
  resultL = 0;
  resultLq = 0;
  resultW = 0;
  resultWq = 0;
  lamdaE = 0;
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
    if (parseFloat(this.lamdaText)) {
      if (regDigits.test(this.kText.trim()) && parseInt(this.kText.trim(), 10) > 0) {
        if (regDigits.test(this.sText.trim()) && parseInt(this.sText.trim(), 10) > 0
          && parseInt(this.sText.trim(), 10) < parseInt(this.kText.trim(), 10)) {
          if (( parseFloat(this.muText) * parseInt(this.sText.trim(), 10)) > parseFloat(this.lamdaText)) {
            if (parseFloat(this.csText) >= 0) {
              if (parseFloat(this.cwText) >= 0) {
                this.lamdaNumber = parseFloat(this.lamdaText);
                this.muNumber = parseFloat(this.muText);
                this.sNumber = parseInt(this.sText.trim(), 10);
                this.kNumber = parseInt(this.kText.trim(), 10);
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
    this.lamdaE = 0;

    this.resultRo = (this.lamdaNumber / (this.sNumber * this.muNumber));
    let tempP01 = 0;
    for (let n = 0; n <= this.sNumber; n++) {
      tempP01 += (((Math.pow(this.lamdaNumber / this.muNumber, n)) / (this.factorial(n))));
    }
    let tempP02 = 0;
    for (let n = this.sNumber + 1; n <= this.kNumber; n++) {
      tempP02 += Math.pow(this.resultRo, (n - this.sNumber));
    }
    this.resultP0 = 1 / (tempP01 + (((Math.pow(this.lamdaNumber / this.muNumber, this.sNumber)) / this.factorial(this.sNumber)) * tempP02));
    const firstLq = this.resultP0 * Math.pow(this.lamdaNumber / this.muNumber, this.sNumber) * this.resultRo;
    const secondLq = this.factorial(this.sNumber) * Math.pow(1 - this.resultRo, 2);
    const thirdLq = 1 - Math.pow(this.resultRo, (this.kNumber - this.sNumber)) - (this.kNumber - this.sNumber) *
      Math.pow(this.resultRo, (this.kNumber - this.sNumber)) * (1 - this.resultRo);
    this.resultLq = (firstLq / secondLq) * thirdLq;

    this.lamdaE = this.lamdaNumber * (1 - this.obtainPn(this.resultP0, this.lamdaNumber, this.muNumber, this.sNumber, this.kNumber));
    this.resultWq = this.resultLq / this.lamdaE;
    this.resultW = this.resultWq + (1 / this.muNumber);
    this.resultL = this.lamdaE * this.resultW;

    this.resultCt = (this.resultLq * this.cwNumber) + (this.sNumber * this.csNumber);

    this.resultP0 = Math.round(this.resultP0 * 10000) / 10000;
    this.resultRo = Math.round(this.resultRo * 10000) / 10000;
    this.resultL = Math.round(this.resultL * 10000) / 10000;
    this.resultLq = Math.round(this.resultLq * 10000) / 10000;
    this.resultW = Math.round(this.resultW * 10000) / 10000;
    this.resultWq = Math.round(this.resultWq * 10000) / 10000;

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
