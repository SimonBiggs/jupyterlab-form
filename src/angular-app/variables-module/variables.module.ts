/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule, MatTableModule
} from '@angular/material';

import { NumberComponent } from './number.component';
import { StringComponent } from './string.component';
import { TableComponent } from './table.component';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    FormsModule
  ],
  declarations: [
    NumberComponent,
    StringComponent,
    TableComponent
  ],
  exports: [
    NumberComponent,
    StringComponent,
    TableComponent
  ]
})
export class VariablesModule { }
