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

  lamdaText = '';
  muText = '';
  sText= '';
  csText = '';
  cwText = '';

  csNumber = 0;
  cwNumber = 0;
  private lamdaNumber: number;
  private muNumber: number;
  private sNumber: number;
  n = 0;
  resultP0 = 0;
  resultRo = 0;
  resultL = 0;
  resultLq = 0;
  resultW = 0;
  resultWq = 0;
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
      if (regDigits.test(this.sText.trim()) && parseInt(this.sText.trim(), 10) > 1) {
        if ( ( parseFloat(this.muText) * parseInt(this.sText.trim(), 10))  > parseFloat(this.lamdaText) ) {
          if (parseFloat(this.csText) >= 0) {
            if (parseFloat(this.cwText) >= 0) {
              this.lamdaNumber = parseFloat(this.lamdaText);
              this.muNumber = parseFloat(this.muText);
              this.sNumber = parseInt(this.sText.trim(), 10);
              this.csNumber = parseFloat(this.csText);
              this.cwNumber = parseFloat(this.cwText);
              this.simulateRow();
            } else {
              this.onShowFlashMessage('Cw debe ser un número mayor o igual a cero', false);
            }
          } else {
            this.onShowFlashMessage('Cs debe ser un número mayor o igual cero', false);
          }
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
    this.resultP0 = 0;
    this.resultRo = 0;
    this.resultL = 0;
    this.resultLq = 0;
    this.resultW = 0;
    this.resultWq = 0;

    this.resultRo = (this.lamdaNumber / (this.sNumber * this.muNumber));
    let tempP0 = 0;
    for (this.n; this.n < this.sNumber; this.n++) {
      tempP0 += (((Math.pow(this.lamdaNumber / this.muNumber, this.n)) / (this.factorial(this.n))));
    }
    this.resultP0 = 1 / ((tempP0) + (((Math.pow(this.lamdaNumber / this.muNumber, this.sNumber)) / (this.factorial(this.sNumber)))) *
      (1 / (1 - this.resultRo )));
    const firstLq = this.resultRo * Math.pow(this.lamdaNumber / this.muNumber, this.sNumber) * this.resultP0;
    const secondLq = this.factorial(this.sNumber) * Math.pow((1 - this.resultRo), 2);
    this.resultLq = firstLq / secondLq;
    this.resultL = this.resultLq + (this.lamdaNumber / this.muNumber);
    this.resultWq = this.resultLq / this.lamdaNumber;
    this.resultW = this.resultWq + (1 / this.muNumber);

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
}
