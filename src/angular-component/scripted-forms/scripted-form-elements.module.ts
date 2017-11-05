/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MaterialModule,
  // MatButtonModule, MatInputModule, MatIconModule,
  // MatIconRegistry
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// import { DomSanitizer } from '@angular/platform-browser';

import { CodeComponent } from './code.component';

import { KernelService } from './kernel.service';
import { VariableService } from './variable.service';
import { OutputService } from './output.service';

import { StartComponent } from './start.component';
import { LiveComponent } from './live.component';
import { ButtonComponent } from './button.component';
import { VariableComponent } from './variable.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    // MatButtonModule, MatInputModule, MatIconModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  declarations: [
    CodeComponent,
    StartComponent,
    LiveComponent,
    ButtonComponent,
    VariableComponent
  ],
  providers: [
    KernelService,
    VariableService,
    OutputService
  ],
  exports: [
    CodeComponent,
    StartComponent,
    LiveComponent,
    ButtonComponent,
    VariableComponent
  ]
})
export class ScriptedFormElementsModule { 
  // constructor(mdIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
  //   mdIconRegistry.addSvgIconSet(
  //     domSanitizer.bypassSecurityTrustResourceUrl('./mdi.svg'));
  // }
}
