/*
The forms module.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ScriptedFormElementsModule } from './scripted-form-elements.module';

import { KernelService } from './kernel.service';
import { FormComponent } from './form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ScriptedFormElementsModule
  ],
  declarations: [
    FormComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    FormComponent
  ]
})
export class ScriptedFormsModule { }
