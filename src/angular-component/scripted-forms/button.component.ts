/*
Creates the [button] section.

A section that runs all code within it whenever the user presses the provided
button.

By calling the function `runCode` on this component all code components within
this section will be iteratively run. The button is set to call the runCode
function on click.
*/

import {
  Component, OnInit, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { CodeComponent } from './code.component';
import { KernelService } from './kernel.service';

@Component({
  selector: 'app-button',
  template: `
<div>
  <ng-content></ng-content>
  <div align="right">
    <button
    mat-mini-fab
    (click)="runCode()"
    [disabled]="!isFormReady || codeRunning">
      <mat-icon>keyboard_return</mat-icon>
    </button>
  </div>
</div>
`
})
export class ButtonComponent implements OnInit, AfterViewInit {

  buttonId: number;
  afterViewInit = false;
  isFormReady = false;

  codeRunning = false;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  constructor(
    private myKernelSevice: KernelService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.afterViewInit = true;
  }

  runCode() {
    if (this.afterViewInit && this.isFormReady) {
      this.codeComponents.toArray().forEach((codeComponent, index) => {
        codeComponent.runCode();
      });
      this.codeRunning = true;
      this.myKernelSevice.queue.then(() => {
        this.codeRunning = false;
      });
    }
  }

  formReady() {
    this.isFormReady = true;
  }

  setId(id: number) {
    this.buttonId = id;
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.setName(
        '"button"_' + String(this.buttonId) + '_' + String(index))
    });
  }

}
