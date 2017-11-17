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

import { VariableValue } from '../types/variable-value';


@Component({})
export class VariableBaseComponent implements AfterViewInit {
  isOutput = false;
  isFormReady = false;
  isPandas = false;
  isFocus = false;

  @Output() variableChange = new EventEmitter<any>();
  @ViewChild('variablecontainer') variablecontainer: ElementRef;

  variableName: string;
  oldVariableValue: VariableValue = null;
  variableValue: VariableValue;

  constructor(
    public myChangeDetectorRef: ChangeDetectorRef,
    public myVariableService: VariableService
  ) { }

  onBlur(tableCoords?: [number, string]) {
    // console.log('blur')
    this.isFocus = false;
  }

  onFocus(tableCoords?: [number, string]) {
    // console.log('focus')
    this.isFocus = true;
  }

  variableChanged(value: VariableValue) { 
    // console.log(this.oldVariableValue)
    // console.log(this.variableValue)
    if (this.variableValue != this.oldVariableValue) {
      this.myVariableService.pythonPushVariable(this.variableName, this.variableValue, this.isPandas)
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

  updateVariableView(value: VariableValue) {
    this.variableValue = value
    this.oldVariableValue = JSON.parse(JSON.stringify(value))
  }

  formReady() {
    this.isFormReady = true;
  }

  initialise() {
    this.myVariableService.initialiseVariableComponent(
      this, this.variableName, this.isPandas)
  }
}