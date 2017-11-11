/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule, MatIconModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KernelService } from '../services/kernel.service';

import { StartComponent } from './start.component';
import { LiveComponent } from './live.component';
import { ButtonComponent } from './button.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  declarations: [
    StartComponent,
    LiveComponent,
    ButtonComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    StartComponent,
    LiveComponent,
    ButtonComponent
  ]
})
export class SectionsModule { }
