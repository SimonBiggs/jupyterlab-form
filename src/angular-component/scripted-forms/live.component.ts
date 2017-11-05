/*
Creates the [live] section.

A section that runs all code within it whenever the any VariableComponent
changes within it.

By calling the function `variableChanged` on this component all code components
within this section will be iteratively run. Changes on each contained
variable component are subscribed to and `variableChanged` function is called.
*/

import {
  Component, OnInit, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { VariableComponent } from './variable.component';
import { CodeComponent } from './code.component';

@Component({
  selector: 'app-live',
  template: `<ng-content></ng-content>`
})
export class LiveComponent implements OnInit, AfterViewInit {

  liveId: number;
  afterViewInit = false;
  isFormReady = false;

  @ContentChildren(VariableComponent) variableComponents: QueryList<VariableComponent>;
  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  constructor(
      // private myChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.afterViewInit = true;
    for (const variableComponent of this.variableComponents.toArray()) {
      variableComponent.variableChange.asObservable().subscribe(
        value => this.variableChanged(value)
      );
    }
  }

  variableChanged(variableName: string) {
    if (this.afterViewInit && this.isFormReady) {
      this.codeComponents.toArray().forEach((codeComponent, index) => {
        codeComponent.runCode();
      });
    }
  }

  formReady() {
    this.isFormReady = true;
  }

  setId(id: number) {
    this.liveId = id;

    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.setName(
        '"live"_' + String(this.liveId) + '_' + String(index));
    });
  }
}
