import { BooleanBaseComponent } from './boolean-base.component';

import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-tick',
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
export class TickComponent extends BooleanBaseComponent { }