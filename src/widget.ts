import {
  AngularWidget
} from './angular-loader';

import {
  DemoFormComponent
} from './demo-form/demo-form.component';
  
import {
  DemoFormModule
} from './demo-form.module';


export class FormWidget extends AngularWidget {
  constructor() {
    super(DemoFormModule, DemoFormComponent);
    this.id = '@simonbiggs/jupyterlab-form';
    this.title.label = 'Demo Form';
    this.title.closable = true;
    this.addClass('jp-scriptedFormWidget');
  }
}