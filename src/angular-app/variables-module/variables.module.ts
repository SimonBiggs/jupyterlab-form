/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule, MatTableModule, MatCheckboxModule
} from '@angular/material';

import { BooleanComponent } from './boolean.component';
import { NumberComponent } from './number.component';
import { StringComponent } from './string.component';
import { TableComponent } from './table.component';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule
  ],
  declarations: [
    BooleanComponent,
    NumberComponent,
    StringComponent,
    TableComponent
  ],
  exports: [
    BooleanComponent,
    NumberComponent,
    StringComponent,
    TableComponent
  ]
})
export class VariablesModule { }
