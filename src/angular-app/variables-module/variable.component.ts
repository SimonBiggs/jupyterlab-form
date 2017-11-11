/*
Component that handles both [string] and [number] inputs.

In the future these should be more intelligently split out. Potentially create
a base class from which the two types of inputs inherit.

The VariableComponent calls Python code to derive its value initially. Each
time the value is changed it then recalls Python code to update the value.
*/

import {
  Component, Input, ViewChild, ElementRef, AfterViewInit,
  ChangeDetectorRef, EventEmitter, Output
} from '@angular/core';

import { KernelService } from '../services/kernel.service';
import { VariableService } from '../services/variable.service';

@Component({
  selector: 'app-variable',
  // It is important to not have spaces here before and after
  // ng-content. White space would be sent through to python.
  template: `<span #variablecontainer *ngIf="variableName === undefined"><ng-content></ng-content></span>

<mat-input-container *ngIf="variableName && type=='string'">
  <input
      matInput
      [disabled]="!isFormReady"
      [placeholder]="variableName"
      [(ngModel)]="variableValue"
      (ngModelChange)="variableChanged($event)"
      type="text" class="variableString">
</mat-input-container>

<mat-input-container class="variableNumber" *ngIf="variableName && type=='number'" >
  <input
      matInput
      [disabled]="!isFormReady"
      [placeholder]="variableName"
      [(ngModel)]="variableValue"
      (ngModelChange)="variableChanged($event)"
      type="number">
</mat-input-container>`,
  styles: [
    `.variableNumber {
    width: 80px;
  }
  `]
})
export class VariableComponent implements AfterViewInit {
  fetchCode: string;
  setCode: string;
  isFormReady = false;

  @Input() type: string;
  @Output() variableChange = new EventEmitter<any>();

  @ViewChild('variablecontainer') variablecontainer: ElementRef;

  variableName: string;
  oldVariableValue: string | number = null;
  variableValue: string | number;

  constructor(
    private myChangeDetectorRef: ChangeDetectorRef,
    private myKernelSevice: KernelService,
    private myVariableService: VariableService
  ) { }

  variableChanged(value: string | number) {
    if (this.type.match('string')) {
      this.variableValue = String(this.variableValue);
      const escapedQuotes = this.variableValue.replace(/\"/g, '\\"');
      this.setCode = `${this.variableName} = "${escapedQuotes}"`;
    }
    if (this.type.match('number')) {
      this.setCode = `${this.variableName} = ${this.variableValue}`;
    }

    if (this.variableValue !== this.oldVariableValue) {
      this.myKernelSevice.runCode(
        this.setCode, '"set"_"' + this.variableName + '"'
      ).then(future => {
        if (future) {
          return future.done;
        } else {
          return Promise.resolve('ignore');
        }

      }).then((status) => {
        if (status !== 'ignore') {
          this.variableChange.emit(this.variableName);

          this.myVariableService.setVariable(this.variableName, this.variableValue);
        }
      });
      this.oldVariableValue = this.variableValue;
    }

  }

  ngAfterViewInit() {
    this.variableName = this.variablecontainer.nativeElement.innerHTML;
    this.myChangeDetectorRef.detectChanges();

    this.fetchCode = `
try:
    print('{{ "defined": true, "value": "{}" }}'.format(${this.variableName}))
except:
    print('{"defined": false}')
`;
  }

  fetchVariable() {
    this.myKernelSevice.runCode(this.fetchCode, '"fetch"_"' + this.variableName + '"').then(future => {
      future.onIOPub = ((msg: any) => {
        if (msg.content.name === 'stdout') {
          const result = JSON.parse(msg.content.text);
          if (result.defined) {
            if (this.type.match('string')) {
              this.variableValue = String(result.value);
            }
            if (this.type.match('number')) {
              this.variableValue = Number(result.value);
            }
            this.myVariableService.setVariable(this.variableName, this.variableValue);
          }
        }
      });
    });
  }

  formReady() {
    this.isFormReady = true;
  }
}
