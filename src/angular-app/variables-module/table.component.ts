import { VariableBaseComponent } from './variable-base.component';

import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-table',
  template: `<span #variablecontainer *ngIf="variableName === undefined"><ng-content></ng-content></span>

table goes here`,
})
export class TableComponent extends VariableBaseComponent {
  pullTable() {
    this.pullVariable(true)
  }

  updateVariableView(value: JSON) {
    this.variableValue = value
  }
}