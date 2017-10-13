import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// import { 
//   MatButtonModule, MatInputModule, MatIconModule
// } from '@angular/material'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScriptedFormsModule } from './scripted-forms/scripted-forms.module';

import { DemoFormComponent } from './demo-form/demo-form.component';

@NgModule({
  declarations: [
    DemoFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ScriptedFormsModule
  ],
  entryComponents: [DemoFormComponent]
})
export class DemoFormModule {
  ngDoBootstrap(app: ApplicationRef) {}
};