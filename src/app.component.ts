import {
    Component, OnInit, AfterViewInit, ViewChild, 
    ChangeDetectorRef
} from '@angular/core';

import { FormComponent } from './scripted-forms/form.component';
import { KernelService } from './scripted-forms/kernel.service';

import {
  ServiceManager
} from '@jupyterlab/services';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

@Component({
  selector: 'app-root',
  template: `<div class="margin"><app-form #form></app-form></div>`,
  styles: [`.margin { margin: 20px;}`]
})
export class AppComponent implements OnInit, AfterViewInit {
  formReady = new PromiseDelegate<void>();
  defaultForm = '';

  @ViewChild('form') formComponent: FormComponent;

  constructor(
    private myChangeDetectorRef: ChangeDetectorRef,
    private myKernelService: KernelService
  ) { }

  ngOnInit() { 
  
  }

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

  setServices(services: ServiceManager) {
    this.myKernelService.setServices(services);
  }

  setPath(path: string) {
    this.myKernelService.setPath(path);
  }

  sessionConnect() {
    this.myKernelService.sessionConnect();
  }

  pathChanged(path: string) {
    this.myKernelService.pathChanged(path);
  }

}
