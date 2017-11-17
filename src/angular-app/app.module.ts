/*
The root app module.
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, ErrorHandler } from '@angular/core';

import {
  MatButtonModule, MatInputModule, MatIconModule, MatCheckboxModule
} from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppErrorHandler } from './app-error-handler';

import { KernelService } from './services/kernel.service';
import { VariableService } from './services/variable.service';
import { OutputService } from './services/output.service';

import { FormBuilderModule } from './form-builder-module/form-builder.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    FormBuilderModule
  ],
  entryComponents: [
    AppComponent
  ],
  providers: [
    KernelService,
    OutputService,
    VariableService,
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ]
})
export class AppModule {
  ngDoBootstrap(app: ApplicationRef) {}
}
