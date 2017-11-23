/*
The root app module.
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, ErrorHandler } from '@angular/core';

import {
  MatButtonModule, MatInputModule, MatIconModule, MatCheckboxModule, 
  MatSliderModule
} from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppErrorHandler } from './app-error-handler';

import { KernelService } from './services/kernel.service';
import { VariableService } from './services/variable.service';
import { OutputService } from './services/output.service';
import { JupyterlabModelService } from './services/jupyterlab-model.service';

import { FormBuilderModule } from './form-builder-module/form-builder.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatSliderModule,
    FormBuilderModule
  ],
  entryComponents: [
    AppComponent
  ],
  providers: [
    KernelService,
    OutputService,
    VariableService,
    JupyterlabModelService,
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ]
})
export class AppModule {
  ngDoBootstrap(app: ApplicationRef) {}
}
