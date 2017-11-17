/*
Creates the [live] section.

A section that runs all code within it whenever the any VariableComponent
changes within it.

By calling the function `variableChanged` on this component all code components
within this section will be iteratively run. Changes on each contained
variable component are subscribed to and `variableChanged` function is called.
*/

import {
  Component, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { BooleanComponent } from '../variables-module/boolean.component';
import { NumberComponent } from '../variables-module/number.component';
import { StringComponent } from '../variables-module/string.component';
import { TableComponent } from '../variables-module/table.component';

import { CodeComponent } from '../code-module/code.component';

import { VariableComponent } from '../types/variable-component';

@Component({
  selector: 'app-live',
  template: `<ng-content></ng-content>`
})
export class LiveComponent implements AfterViewInit {

  variableComponents: VariableComponent[] = []

  liveId: number;
  afterViewInit = false;
  isFormReady = false;

  @ContentChildren(BooleanComponent) booleanComponents: QueryList<BooleanComponent>;
  @ContentChildren(NumberComponent) numberComponents: QueryList<NumberComponent>;
  @ContentChildren(StringComponent) stringComponents: QueryList<StringComponent>;
  @ContentChildren(TableComponent) tableComponents: QueryList<TableComponent>;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  ngAfterViewInit() {
    this.afterViewInit = true;

    this.variableComponents = this.variableComponents.concat(this.booleanComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.numberComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.stringComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.tableComponents.toArray())

    for (const variableComponent of this.variableComponents) {
      variableComponent.variableChange.asObservable().subscribe(
        value => this.runCode()
      );
    }
  }

  runCode() {
    // This would be better done with a promise. It should always run, just
    // delayed until read and initialised.
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
