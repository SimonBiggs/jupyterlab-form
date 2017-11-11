/*

*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeComponent } from './code.component';

import { KernelService } from '../services/kernel.service';
import { OutputService } from '../services/output.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CodeComponent
  ],
  providers: [
    KernelService,
    OutputService
  ],
  exports: [
    CodeComponent,
  ]
})
export class CodeModule { }
