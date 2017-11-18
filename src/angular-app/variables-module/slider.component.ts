import {
  Component, AfterViewInit
} from '@angular/core';

import { VariableBaseComponent } from './variable-base.component';
// import { Slider } from '../interfaces/slider';

// import * as  stringify from 'json-stable-stringify';

@Component({
  selector: 'app-slider',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<span class="container">{{variableName}}
  <mat-slider class="variableSlider" *ngIf="variableName" 
    [disabled]="!isFormReady"
    [(ngModel)]="variableValue"
    (ngModelChange)="variableChanged($event)"
    (blur)="onBlur()" 
    (focus)="onFocus()"
    [max]="max"
    [min]="min"
    [step]="step"
    [thumb-label]="true">
  </mat-slider>
</span>`,
styles: [
  `
.container {
  display: flex;
}
  
.variableSlider {
  flex-grow: 1;
}
`]
})
export class SliderComponent extends VariableBaseComponent implements AfterViewInit {
  min: number
  max: number
  step: number
  // sliderValue: number

  // minVariableName: string
  // maxVariableName: string
  // stepVariableName: string

  // variableValue: Slider
  variableValue: number

  ngAfterViewInit() {
    const ngContent = String(this.variablecontainer.nativeElement.innerHTML.trim());
    const items = ngContent.split(',')
    // this.minVariableName = items[0]
    // this.maxVariableName = items[1]
    // this.stepVariableName = items[2]
    this.min = Number(items[0])
    this.max = Number(items[1])
    this.step = Number(items[2])
    
    this.variableName = items[3]
    this.myChangeDetectorRef.detectChanges();
  }

  updateVariableView(value: string | number) {
    value = Number(value)
    super.updateVariableView(value)
  }

  onVariableChange() { 
    // this.variableValue = {
    //   min: this.min,
    //   max: this.max,
    //   step: this.step,
    //   value: this.sliderValue
    // };
  }

  // testIfDifferent() {
  //   return !(stringify(this.variableValue) === stringify(this.oldVariableValue));
  // }

  // pythonValueReference() {
  //   return `json_table_to_df('${JSON.stringify(this.variableValue)}')`
  // }

  // pythonVariableReference() {
  //   return this.variableName.concat(".to_json(orient='table')")
  // }
}