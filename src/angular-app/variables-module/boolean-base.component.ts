import { VariableBaseComponent } from './variable-base.component';

import {
  Component, AfterViewInit
} from '@angular/core';

@Component({})
export class BooleanBaseComponent extends VariableBaseComponent implements AfterViewInit { 
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