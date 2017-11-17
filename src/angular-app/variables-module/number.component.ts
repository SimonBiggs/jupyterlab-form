import { VariableBaseComponent } from './variable-base.component';

import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-number',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<mat-input-container class="variableNumber" *ngIf="variableName" >
  <input
    matInput
    [disabled]="!isFormReady"
    [placeholder]="variableName"
    [(ngModel)]="variableValue"
    (ngModelChange)="variableChanged($event)"
    (blur)="onBlur()" 
    (focus)="onFocus()"
    type="number">
</mat-input-container>`,
  styles: [
    `.variableNumber {
    width: 80px;
  }
  `]
})
export class NumberComponent extends VariableBaseComponent { 
  updateVariableView(value: number) {
    this.variableValue = Number(value);

    this.oldVariableValue = JSON.parse(JSON.stringify(this.variableValue));
  }
}