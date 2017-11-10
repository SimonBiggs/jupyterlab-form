/*
The forms module.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ScriptedFormElementsModule } from './scripted-form-elements.module';

import { KernelService } from './kernel.service';
import { FormBuilderComponent } from './form-builder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ScriptedFormElementsModule
  ],
  declarations: [
    FormBuilderComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    FormBuilderComponent
  ]
})
export class ScriptedFormsModule { }
