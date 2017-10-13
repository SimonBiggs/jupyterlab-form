import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { 
  MatButtonModule, MatInputModule, MatIconModule
} from '@angular/material'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScriptedFormsModule } from './scripted-forms/scripted-forms.module';

import { FormsComponent } from './forms/forms.component';

@NgModule({
  declarations: [
    FormsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatButtonModule, MatInputModule, MatIconModule,
    BrowserAnimationsModule,
    ScriptedFormsModule
  ],
  entryComponents: [FormsComponent]
})
export class DemoFormModule {
  ngDoBootstrap(app: ApplicationRef) {}
};