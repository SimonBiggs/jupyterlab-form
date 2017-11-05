/*
Creates the [start] section.

A section that runs all code within it whenever a kernel is connected to a new
session.

Eventually this section should be set to also rerun if the code within it
differs from the previous iteration. That way a kernel restart would not be
required if new code is added into the [start] section.
*/


import {
  Component, OnInit, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { CodeComponent } from './code.component';

@Component({
  selector: 'app-start',
  template: `<ng-content></ng-content>`
})
export class StartComponent implements OnInit, AfterViewInit {

  startId: number;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  runCode() {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.runCode();
    });
  }

  setId(id: number) {
    this.startId = id;
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.setName(
        '"start"_' + String(this.startId) + '_' + String(index));
    });

  }
}
