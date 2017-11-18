/*
Creates the [start] section.

A section that runs all code within it whenever a kernel is connected to a new
session.

Eventually this section should be set to also rerun if the code within it
differs from the previous iteration. That way a kernel restart would not be
required if new code is added into the [start] section.
*/


import {
  Component, ContentChildren, QueryList
} from '@angular/core';

import { CodeComponent } from '../code-module/code.component';
import { LiveComponent } from '../sections-module/live.component';
import { ButtonComponent } from '../sections-module/button.component';

@Component({
  selector: 'app-start',
  template: `<ng-content></ng-content>
<div align="right" *ngIf="(!hasStartRun)">
  <button
  mat-mini-fab
  (click)="runCode()">
    <mat-icon>autorenew</mat-icon>
  </button>
</div>`
})
export class StartComponent {
  liveComponents: QueryList<LiveComponent>;
  buttonComponents: QueryList<ButtonComponent>;

  startId: number;
  hasStartRun = false;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  provideSections(liveComponents: QueryList<LiveComponent>, buttonComponents: QueryList<ButtonComponent>) {
    this.liveComponents = liveComponents;
    this.buttonComponents = buttonComponents;
  }

  runCode() {
    this.codeComponents.toArray().forEach(codeComponent => {
      codeComponent.runCode();
    });
    this.hasStartRun = true;

    // Instead make start components just replace outputs with the code?

    // this.liveComponents.toArray().forEach(liveComponent => {
    //   liveComponent.clearCodeOutput();
    // });

    // this.buttonComponents.toArray().forEach(buttonComponent => {
    //   buttonComponent.clearCodeOutput();
    // });
  }

  setId(id: number) {
    this.startId = id;
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.setName(
        '"start"_' + String(this.startId) + '_' + String(index));
    });

  }
}
