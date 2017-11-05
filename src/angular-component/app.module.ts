import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// import {
//   MaterialModule
// } from '@angular/material'

// import { DomSanitizer } from '@angular/platform-browser';
import { AppErrorHandler } from './app-error-handler';

import { ScriptedFormsModule } from './scripted-forms/scripted-forms.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // MaterialModule,
    // BrowserAnimationsModule,
    ScriptedFormsModule
  ],
  entryComponents: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ]
})
export class AppModule {
  // constructor(mdIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
  //   mdIconRegistry.addSvgIconSet(
  //     domSanitizer.bypassSecurityTrustResourceUrl('./mdi.svg'));
  // }
  ngDoBootstrap(app: ApplicationRef) {}
}
