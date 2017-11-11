/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule
} from '@angular/material';

import { VariableComponent } from './variable.component';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule
  ],
  declarations: [
    VariableComponent
  ],
  exports: [
    VariableComponent
  ]
})
export class VariablesModule { }
