import {
  Component, OnInit, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { CodeComponent } from './code.component'

@Component({
  selector: 'form-start',
  template: `<ng-content></ng-content>`
})
export class StartComponent implements OnInit, AfterViewInit {

  startId: number

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  runCode() {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.runCode()
    })
  }

  setId(id: number) {
    this.startId = id
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.setName(
        '"start"_' + String(this.startId) + '_' + String(index))
    })

  }
}
