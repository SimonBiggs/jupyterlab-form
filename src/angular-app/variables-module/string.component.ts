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

<mat-input-container class="variableString" *ngIf="variableName">
  <textarea
    matInput matTextareaAutosize
    [disabled]="!isFormReady"
    [placeholder]="variableName"
    [(ngModel)]="variableValue"
    (ngModelChange)="variableChanged($event)"
    (blur)="onBlur()" 
    (focus)="onFocus()"
    type="text" class="variableString"></textarea>
</mat-input-container>`,
styles: [
  `.variableString {
  width: 100%;
}
`]
})
export class StringComponent extends VariableBaseComponent { 
  variableValue: string

  updateVariableView(value: string) {
    value = String(value)
    super.updateVariableView(value)
  }

  pythonValueReference() {
    const escapedString = this.variableValue
    .replace(/\"/g, '\\"')
    .replace(/\\/g, '\\\\')
    const valueReference = `"""${String(escapedString)}"""`

    return valueReference
  }
}