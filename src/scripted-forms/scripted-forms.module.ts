import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { 
  MatButtonModule, MatInputModule, MatIconModule
} from '@angular/material'

import { ScriptedFormElementsModule } from './scripted-form-elements.module';

import { KernelService } from './kernel.service';
import { FormComponent } from './form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule, MatInputModule, MatIconModule,
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
