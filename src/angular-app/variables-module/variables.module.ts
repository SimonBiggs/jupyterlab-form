/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { CodeModule } from '../code-module/code.module'

import { KernelService } from '../services/kernel.service';
import { VariableService } from '../services/variable.service';
import { VariableComponent } from './variable.component';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    // CodeModule
  ],
  declarations: [
    VariableComponent
  ],
  providers: [
    KernelService,
    VariableService
  ],
  exports: [
    VariableComponent
  ]
})
export class VariablesModule { }
