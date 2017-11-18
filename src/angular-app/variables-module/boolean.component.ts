import { VariableBaseComponent } from './variable-base.component';

import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-boolean',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<mat-checkbox 
  [(ngModel)]="variableValue"
  (ngModelChange)="variableChanged($event)">
  {{variableName}}
</mat-checkbox>`,
})
export class BooleanComponent extends VariableBaseComponent { 
  variableValue: boolean;
  updateVariableView(value: string) {
    if (value === 'True') {
      this.variableValue = true
    } else if (value === 'False') {
      this.variableValue = false
    } else {
      RangeError("Unexpected boolean response")
    }
    this.updateOldVariable()
  }

  pythonValueReference() {
    let valueReference: string;
    if (this.variableValue) {
      valueReference = 'True'
    } else {
      valueReference = 'False'
    }

    return valueReference
  }
}