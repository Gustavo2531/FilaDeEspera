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

  textLambda = '';
  textMu = '';
  textDistribution = '';
  textParamErlang = '';
  textParamOther = '';
  csText = '';
  cwText = '';

  invalidParamText = '';

  numLambda = 0;
  numMu = 0;
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
    if (parseFloat(this.textLambda)) {
      if (parseFloat(this.textMu) > parseFloat(this.textLambda)) {
        if (this.textDistribution === '1' || this.textDistribution === '2') {
          if (this.distributionExtraParamIsValid()) {
            if (parseFloat(this.csText) >= 0) {
              if (parseFloat(this.cwText) >= 0) {
                this.numLambda = parseFloat(this.textLambda);
                this.numMu = parseFloat(this.textMu);
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
    switch (this.textDistribution) {
      case '1':
        if (regDigits.test(this.textParamErlang.trim()) && parseInt(this.textParamErlang.trim(), 10) > 0) {
          paramIsValid = true;
          this.parameterNumber = parseInt(this.textParamErlang.trim(), 10);
        } else {
          paramIsValid = false;
          this.invalidParamText = 'El parámetro k de Erlang debe ser un entero mayor a 0';
        }
        break;
      case '2':
        if (parseFloat(this.textParamOther) >= 0) {
          paramIsValid = true;
          this.parameterNumber = parseFloat(this.textParamOther);
        } else {
          paramIsValid = false;
          this.invalidParamText = 'La desviación estándar de su distribución debe ser un número mayor o igual a cero';
        }
        break;
    }
    return paramIsValid;
  }

  simulateRow() {
    this.resultRo = (this.numLambda) / (this.numMu);
    this.resultP0 = (1 - this.resultRo);
    const firstLq = ((this.numLambda * this.numLambda) * this.getVariance(this.textDistribution,
      this.parameterNumber, this.numMu) ) + (this.resultRo * this.resultRo);
    const secondLq = 2 * this.resultP0;
    this.resultLq = firstLq / secondLq;
    this.resultL = (this.resultRo) + this.resultLq;
    this.resultWq = (this.resultLq) / (this.numLambda);
    this.resultW = (this.resultWq) + ( 1 / (this.numMu) );

    this.resultCt = (this.resultLq * this.cwNumber) + (this.sNumber * this.csNumber);

    
    this.resultL = Math.round(this.resultL * 10000) / 10000;
    this.resultLq = Math.round(this.resultLq * 10000) / 10000;
    this.resultW = Math.round(this.resultW * 10000) / 10000;
    this.resultWq = Math.round(this.resultWq * 10000) / 10000;
    this.resultRo = Math.round(this.resultRo * 10000) / 10000;
    this.resultP0 = Math.round(this.resultP0 * 10000) / 10000;

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
