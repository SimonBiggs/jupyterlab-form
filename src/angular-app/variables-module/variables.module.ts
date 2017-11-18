/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule, MatTableModule, MatCheckboxModule, MatSlideToggleModule
} from '@angular/material';

import { ToggleComponent } from './toggle.component';
import { TickComponent } from './tick.component';
import { NumberComponent } from './number.component';
import { StringComponent } from './string.component';
import { TableComponent } from './table.component';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule
  ],
  declarations: [
    ToggleComponent,
    TickComponent,
    NumberComponent,
    StringComponent,
    TableComponent
  ],
  exports: [
    ToggleComponent,
    TickComponent,
    NumberComponent,
    StringComponent,
    TableComponent
  ]
})
export class VariablesModule { }
