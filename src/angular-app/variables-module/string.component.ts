import { VariableBaseComponent } from './variable-base.component';

import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-string',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<mat-input-container *ngIf="variableName">
  <input
    matInput
    [disabled]="!isFormReady"
    [placeholder]="variableName"
    [(ngModel)]="variableValue"
    (ngModelChange)="variableChanged($event)"
    (blur)="onBlur()" 
    (focus)="onFocus()"
    type="text" class="variableString">
</mat-input-container>`,
})
export class StringComponent extends VariableBaseComponent { 
  updateVariableView(value: string) {
    this.variableValue = String(value)

    this.oldVariableValue = JSON.parse(JSON.stringify(this.variableValue));
  }
}