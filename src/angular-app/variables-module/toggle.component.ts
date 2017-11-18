import { BooleanBaseComponent } from './boolean-base.component';

import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-toggle',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<mat-slide-toggle 
  [(ngModel)]="variableValue"
  (ngModelChange)="variableChanged($event)">
  {{variableName}}
</mat-slide-toggle>`,
})
export class ToggleComponent extends BooleanBaseComponent { }