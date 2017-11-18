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
    this.isFocus = false;
  }

  onFocus(tableCoords?: [number, string]) {
    this.isFocus = true;
  }

  pythonValueReference() {
    return String(this.variableValue);
  }

  pythonVariableReference() {
    return `json.dumps(str(${this.variableName}))`
  }

  testIfDifferent() {
    return this.variableValue != this.oldVariableValue
  }

  updateOldVariable() {
    this.oldVariableValue = this.variableValue;
  }

  variableChanged(value: VariableValue) { 
    if (this.testIfDifferent()) {
      const valueReference = this.pythonValueReference()
      this.myVariableService.pushVariable(this.variableName, valueReference)
      .then((status) => {
        if (status !== 'ignore') {
          this.variableChange.emit(this.variableName);
        }
      });
      this.updateOldVariable();
    }
  }

  ngAfterViewInit() {
    this.variableName = this.variablecontainer.nativeElement.innerHTML.trim();
    this.myChangeDetectorRef.detectChanges();
  }

  updateVariableView(value: VariableValue) {
    if (!this.isFocus) {
      this.variableValue = value
      this.oldVariableValue = JSON.parse(JSON.stringify(value))
    }
  }

  formReady() {
    this.isFormReady = true;
  }

  initialise() {
    this.myVariableService.initialiseVariableComponent(this)
  }
}