import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// import { 
//   MaterialModule
// } from '@angular/material'

// import { DomSanitizer } from '@angular/platform-browser';
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
    // MaterialModule,
    BrowserAnimationsModule,
    ScriptedFormsModule
  ],
  entryComponents: [DemoFormComponent]
})
export class DemoFormModule {
  // constructor(mdIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
  //   mdIconRegistry.addSvgIconSet(
  //     domSanitizer.bypassSecurityTrustResourceUrl('./mdi.svg'));
  // }
  ngDoBootstrap(app: ApplicationRef) {}
};