/*
The forms module.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderComponent } from './form-builder.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormBuilderComponent
  ],
  exports: [
    FormBuilderComponent
  ]
})
export class FormBuilderModule { }
