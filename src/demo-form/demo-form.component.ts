import {
    Component, OnInit, AfterViewInit, ViewChild
} from '@angular/core';

// import { ScriptedFormsModule } from '../scripted-forms/scripted-forms.module';
import { FormComponent } from '../scripted-forms/form/form.component';

// import { Mode } from '@jupyterlab/codemirror';

import { FORMCONTENTS } from './demo-form-contents';

@Component({
  selector: 'app-demo-form',
  templateUrl: './demo-form.component.html',
  styleUrls: ['./demo-form.component.css']
})
export class DemoFormComponent implements OnInit, AfterViewInit {

  defaultForm = FORMCONTENTS;

  @ViewChild('form') formComponent: FormComponent;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.formComponent.setFormContents(FORMCONTENTS);
    this.formComponent.activateForm();
  }

}
