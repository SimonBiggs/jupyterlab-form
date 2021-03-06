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

import { ToggleComponent } from '../variables-module/toggle.component';
import { TickComponent } from '../variables-module/tick.component';
import { NumberComponent } from '../variables-module/number.component';
import { SliderComponent } from '../variables-module/slider.component';
import { TableComponent } from '../variables-module/table.component';
import { StringComponent } from '../variables-module/string.component';

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

  @ContentChildren(ToggleComponent) toggleComponents: QueryList<ToggleComponent>;
  @ContentChildren(TickComponent) tickComponents: QueryList<TickComponent>;
  @ContentChildren(NumberComponent) numberComponents: QueryList<NumberComponent>;
  @ContentChildren(SliderComponent) sliderComponents: QueryList<SliderComponent>;
  @ContentChildren(TableComponent) tableComponents: QueryList<TableComponent>;
  @ContentChildren(StringComponent) stringComponents: QueryList<StringComponent>;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  ngAfterViewInit() {
    this.afterViewInit = true;

    this.variableComponents = this.variableComponents.concat(this.toggleComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.tickComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.numberComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.sliderComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.tableComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.stringComponents.toArray())

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

  clearCodeOutput() {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.hideOutput();
    });
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
