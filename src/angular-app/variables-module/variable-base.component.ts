/*
Component that handles both [string] and [number] inputs.

In the future these should be more intelligently split out. Potentially create
a base class from which the two types of inputs inherit.

The VariableComponent calls Python code to derive its value initially. Each
time the value is changed it then recalls Python code to update the value.
*/

import {
  Component, ViewChild, ElementRef, AfterViewInit,
  ChangeDetectorRef, EventEmitter, Output
} from '@angular/core';

import { VariableService } from '../services/variable.service';

@Component({})
export class VariableBaseComponent implements AfterViewInit {
  isFormReady = false;
  isPandas = false;

  @Output() variableChange = new EventEmitter<any>();
  @ViewChild('variablecontainer') variablecontainer: ElementRef;

  variableName: string;
  oldVariableValue: string | number | {}[] = null;
  variableValue: string | number | {}[];

  constructor(
    public myChangeDetectorRef: ChangeDetectorRef,
    public myVariableService: VariableService
  ) { }

  variableChanged(value: string | number) { 
    if (this.variableValue !== this.oldVariableValue) {
      this.myVariableService.pythonPushVariable(this.variableName, this.variableValue)
      .then((status) => {
        if (status !== 'ignore') {
          this.variableChange.emit(this.variableName);
        }
      });
      this.oldVariableValue = this.variableValue;
    }
  }

  ngAfterViewInit() {
    this.variableName = this.variablecontainer.nativeElement.innerHTML.trim();
    this.myChangeDetectorRef.detectChanges();
  }

  pullVariable() {
    this.myVariableService.pythonPullVariable(this.variableName, this.isPandas)
    .then(future => {
      future.onIOPub = ((msg: any) => {
        if (msg.content.name === 'stdout') {
          console.log(msg.content.text)
    
          const result = JSON.parse(msg.content.text);
          if (result.defined) {
            this.updateVariableView(result.value);
          }
        }
      }); 
    })
  }

  updateVariableView(value: string | number | {}[]) {
    this.variableValue = value
  }

  formReady() {
    this.isFormReady = true;
  }



}
