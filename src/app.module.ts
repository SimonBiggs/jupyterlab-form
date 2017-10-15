import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// import { 
//   MaterialModule
// } from '@angular/material'

// import { DomSanitizer } from '@angular/platform-browser';

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
  entryComponents: [AppComponent]
})
export class AppModule {
  // constructor(mdIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
  //   mdIconRegistry.addSvgIconSet(
  //     domSanitizer.bypassSecurityTrustResourceUrl('./mdi.svg'));
  // }
  ngDoBootstrap(app: ApplicationRef) {}
};