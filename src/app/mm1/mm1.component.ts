import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-mm1',
  templateUrl: './mm1.component.html',
  styleUrls: ['./mm1.component.css']
})
export class Mm1Component implements OnInit {
  showFlashMessage = false;
  flashMessageSuccess = true;
  flashMessage = '';

  lambdaText = '';
  muText = '';
  csText = '';
  cwText = '';

  lambdaNumber = 0;
  muNumber = 0;
  sNumber = 1;
  csNumber = 0;
  cwNumber = 0;

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
    if (parseFloat(this.lambdaText) > 0) {
      if (parseFloat(this.muText) > parseFloat(this.lambdaText)) {
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
        this.onShowFlashMessage('μ debe ser un número válido mayor a λ para que el sistema sea estable.', false);
      }
    } else {
      this.onShowFlashMessage('λ debe ser un número mayor a 1.', false);
    }
  }

  simulateRow() {
    this.resultRo = (this.lambdaNumber) / (this.muNumber);
    this.resultP0 = (1 - this.resultRo);
    this.resultL = (this.lambdaNumber) / ( this.muNumber - this.lambdaNumber );
    this.resultLq = ( (this.lambdaNumber) * (this.lambdaNumber) ) / ( (this.muNumber) * ( (this.muNumber) - (this.lambdaNumber) ) );
    this.resultW = 1 / ( (this.muNumber) - (this.lambdaNumber) );
    this.resultWq = (this.lambdaNumber) / ( (this.muNumber) * ( (this.muNumber) - (this.lambdaNumber) ) );

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

}
