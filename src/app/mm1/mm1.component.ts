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

  textLambda = '';
  textMu = '';
  csText = '';
  cwText = '';

  numLambda = 0;
  numMu = 0;
  numS = 1;
  csNumber = 0;
  cwNumber = 0;

  resultL = 0;
  resultLq = 0;
  resultW = 0;
  resultWq = 0;
  resultP0 = 0;
  resultRo = 0;
  
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
    if (parseFloat(this.textLambda) > 0) {
      if (parseFloat(this.textMu) > parseFloat(this.textLambda)) {
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
        this.onShowFlashMessage('μ debe ser un número válido mayor a λ para que el sistema sea estable.', false);
      }
    } else {
      this.onShowFlashMessage('λ debe ser un número mayor a 1.', false);
    }
  }

  simulateRow() {
    this.resultL = (this.numLambda) / ( this.numMu - this.numLambda );
    this.resultLq = ( (this.numLambda) * (this.numLambda) ) / ( (this.numMu) * ( (this.numMu) - (this.numLambda) ) );
    this.resultW = 1 / ( (this.numMu) - (this.numLambda) );
    this.resultWq = (this.numLambda) / ( (this.numMu) * ( (this.numMu) - (this.numLambda) ) );
    this.resultRo = (this.numLambda) / (this.numMu);
    this.resultP0 = (1 - this.resultRo);
   

    this.resultCt = (this.resultLq * this.cwNumber) + (this.numS * this.csNumber);

   
    this.resultL = Math.round(this.resultL * 10000) / 10000;
    this.resultLq = Math.round(this.resultLq * 10000) / 10000;
    this.resultW = Math.round(this.resultW * 10000) / 10000;
    this.resultWq = Math.round(this.resultWq * 10000) / 10000;
    this.resultRo = Math.round(this.resultRo * 10000) / 10000;
    this.resultP0 = Math.round(this.resultP0 * 10000) / 10000;
    this.resultCt = Math.round(this.resultCt * 10000) / 10000;

    this.onShowFlashMessage('Medidas de desempeño y P0 calculadas con éxito', true);
  }

}
