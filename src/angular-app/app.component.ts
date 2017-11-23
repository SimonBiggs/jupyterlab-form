/*
The root form component.

Passes the jupyterlab session into the kernel service and connects. Passes
through the `setFormContents` function.
*/

import {
  Component, ViewChild
} from '@angular/core';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import { FormBuilderComponent } from './form-builder-module/form-builder.component';
import { KernelService } from './services/kernel.service';
import { JupyterlabModelService } from './services/jupyterlab-model.service';

import {
  ServiceManager
} from '@jupyterlab/services';

@Component({
  selector: 'app-root',
  template: `<div class="margin"><app-form-builder #form></app-form-builder></div>`,
  styles: [`.margin { margin: 20px;}`]
})
export class AppComponent {
  @ViewChild('form') formBuilderComponent: FormBuilderComponent;

  constructor(
    private myKernelService: KernelService,
    private myJupyterlabModelService: JupyterlabModelService
  ) { }

  /**
   * Set or update the template of the form.
   * 
   * @param template: The template to set the form with
   */
  public setTemplateAndBuildForm(template: string) {
    this.myJupyterlabModelService.setTemplate(template);
    this.formBuilderComponent.buildForm();
  }

  public setDocumentModel(model: DocumentRegistry.IModel) {
    this.myJupyterlabModelService.setModel(model);
  }

  public modelReady(): Promise<void> {
    return this.myJupyterlabModelService.modelReady.promise;
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
