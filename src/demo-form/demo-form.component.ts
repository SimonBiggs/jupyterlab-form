import {
    Component, OnInit, AfterViewInit, ViewChild, 
    ChangeDetectorRef
} from '@angular/core';

// import { ScriptedFormsModule } from '../scripted-forms/scripted-forms.module';
import { FormComponent } from '../scripted-forms/form.component';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

// import { Mode } from '@jupyterlab/codemirror';

// import { FORMCONTENTS } from './demo-form-contents';

@Component({
  selector: 'app-demo-form',
  template: `<div class="margin"><app-form #form></app-form></div>`,
  styles: [`.margin { margin: 20px;}`]
})
export class DemoFormComponent implements OnInit, AfterViewInit {
  formReady = new PromiseDelegate<void>();
  defaultForm = '';

  @ViewChild('form') formComponent: FormComponent;

  constructor(
    private myChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.setFormContents(this.defaultForm)
    this.formComponent.formReady.promise.then(() => {
      this.formReady.resolve(undefined);
    })
    this.myChangeDetectorRef.detectChanges();
  }

  setFormContents(formContents: string) {
    this.formComponent.setFormContents(formContents);
  }

}
