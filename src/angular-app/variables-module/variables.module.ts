/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule, MatTableModule, MatCheckboxModule, MatSlideToggleModule,
  MatSliderModule
} from '@angular/material';

import { ToggleComponent } from './toggle.component';
import { TickComponent } from './tick.component';

import { NumberComponent } from './number.component';
import { SliderComponent } from './slider.component';
import { TableComponent } from './table.component';

import { StringComponent } from './string.component';


@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,
    FormsModule
  ],
  declarations: [
    ToggleComponent,
    TickComponent,
    NumberComponent,
    SliderComponent,
    StringComponent,
    TableComponent
  ],
  exports: [
    ToggleComponent,
    TickComponent,
    NumberComponent,
    SliderComponent,
    StringComponent,
    TableComponent
  ]
})
export class VariablesModule { }
