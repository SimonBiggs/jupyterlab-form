import {
    Component, OnInit, AfterViewInit, ViewChild
} from '@angular/core';

// import { ScriptedFormsModule } from '../scripted-forms/scripted-forms.module';
import { FormComponent } from '../scripted-forms/form.component';

// import { Mode } from '@jupyterlab/codemirror';

import { FORMCONTENTS } from './demo-form-contents';

@Component({
  selector: 'app-demo-form',
  template: `<app-form #form></app-form>`,
})
export class DemoFormComponent implements OnInit, AfterViewInit {

  defaultForm = FORMCONTENTS;

  @ViewChild('form') formComponent: FormComponent;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.formComponent.setFormContents(FORMCONTENTS);
  }

}
