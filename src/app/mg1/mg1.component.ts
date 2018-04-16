import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-mg1',
  templateUrl: './mg1.component.html',
  styleUrls: ['./mg1.component.css']
})
export class Mg1Component implements OnInit {

  showFlashMessage = false;
  flashMessageSuccess = true;
  flashMessage = '';

  lambdaText = '';
  muText = '';
  distributionText = '';
  parameterErlangText = '';
  parameterOtherText = '';
  csText = '';
  cwText = '';

  invalidParamText = '';

  lambdaNumber = 0;
  muNumber = 0;
  parameterNumber = 0;
  csNumber = 0;
  cwNumber = 0;
  sNumber = 1;

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
    if (parseFloat(this.lambdaText)) {
      if (parseFloat(this.muText) > parseFloat(this.lambdaText)) {
        if (this.distributionText === '1' || this.distributionText === '2') {
          if (this.distributionExtraParamIsValid()) {
            if (parseFloat(this.csText) >= 0) {
              if (parseFloat(this.cwText) >= 0) {
                this.lambdaNumber = parseFloat(this.lambdaText);
                this.muNumber = parseFloat(this.muText);
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
            this.onShowFlashMessage(this.invalidParamText, false);
          }
        } else {
          this.onShowFlashMessage('Debe elegir un tipo de distribución para el tiempo de servicio', false);
        }
      } else {
        this.onShowFlashMessage('μ debe ser un número válido mayor a λ para que el sistema sea estable.', false);
      }
    } else {
      this.onShowFlashMessage('λ debe ser un número mayor o igual a 1.', false);
    }
  }

  distributionExtraParamIsValid(): boolean {
    let paramIsValid = false;
    const regDigits = /^\d+$/;
    switch (this.distributionText) {
      case '1':
        if (regDigits.test(this.parameterErlangText.trim()) && parseInt(this.parameterErlangText.trim(), 10) > 0) {
          paramIsValid = true;
          this.parameterNumber = parseInt(this.parameterErlangText.trim(), 10);
        } else {
          paramIsValid = false;
          this.invalidParamText = 'El parámetro k de Erlang debe ser un entero mayor a 0';
        }
        break;
      case '2':
        if (parseFloat(this.parameterOtherText) >= 0) {
          paramIsValid = true;
          this.parameterNumber = parseFloat(this.parameterOtherText);
        } else {
          paramIsValid = false;
          this.invalidParamText = 'La desviación estándar de su distribución debe ser un número mayor o igual a cero';
        }
        break;
    }
    return paramIsValid;
  }

  simulateRow() {
    this.resultRo = (this.lambdaNumber) / (this.muNumber);
    this.resultP0 = (1 - this.resultRo);
    const firstLq = ((this.lambdaNumber * this.lambdaNumber) * this.getVariance(this.distributionText,
      this.parameterNumber, this.muNumber) ) + (this.resultRo * this.resultRo);
    const secondLq = 2 * this.resultP0;
    this.resultLq = firstLq / secondLq;
    this.resultL = (this.resultRo) + this.resultLq;
    this.resultWq = (this.resultLq) / (this.lambdaNumber);
    this.resultW = (this.resultWq) + ( 1 / (this.muNumber) );

    this.resultCt = (this.resultLq * this.cwNumber) + (this.sNumber * this.csNumber);

    this.resultRo = Math.round(this.resultRo * 10000) / 10000;
    this.resultP0 = Math.round(this.resultP0 * 10000) / 10000;
    this.resultL = Math.round(this.resultL * 10000) / 10000;
    this.resultLq = Math.round(this.resultLq * 10000) / 10000;
    this.resultW = Math.round(this.resultW * 10000) / 10000;
    this.resultWq = Math.round(this.resultWq * 10000) / 10000;

    this.resultCt = Math.round(this.resultCt * 10000) / 10000;

    this.onShowFlashMessage('Medidas de desempeño y P0 calculadas con éxito', true);
  }

  getVariance(option: string, param: number, mu: number): number {
    let variance = 0;

    switch (option) {
      case '1': // Erlang
          variance = 1 / (param * (mu * mu));
        break;
      case '2': // Other
        variance = param;
        break;
    }

    return variance;
  }

}
