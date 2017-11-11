/*
The root form component.

Passes the jupyterlab session into the kernel service and connects. Passes
through the `setFormContents` function.
*/

import {
    Component, ViewChild
} from '@angular/core';

import { FormBuilderComponent } from './form-builder-module/form-builder.component';
import { KernelService } from './services/kernel.service';

import {
  ServiceManager
} from '@jupyterlab/services';

@Component({
  selector: 'app-root',
  template: `<div class="margin"><app-form #form></app-form></div>`,
  styles: [`.margin { margin: 20px;}`]
})
export class AppComponent {
  @ViewChild('form') formBuilderComponent: FormBuilderComponent;

  constructor(
    private myKernelService: KernelService
  ) { }

  /**
   * Set or update the template of the form.
   * 
   * @param formContents: The template to set the form with
   */
  public setFormContents(formContents: string) {
    this.formBuilderComponent.setFormContents(formContents);
  }

  /**
   * Given a Jupyterlab session manager either reconnect to existing kernel
   * or start a new kernel at the provided path.
   * 
   * @param services: The jupyterlab service manager.
   * @param path: The kernel session filepath.
   */
  public sessionConnect(services: ServiceManager, path: string) {
    this.myKernelService.setServices(services);
    this.myKernelService.setPath(path);
    this.myKernelService.sessionConnect();
  }

  /**
   * Inform the kernel service that its path has changed.
   * 
   * @param path: The kernel session filepath.
   */
  public pathChanged(path: string) {
    this.myKernelService.pathChanged(path);
  }
}
