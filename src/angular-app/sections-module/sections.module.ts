/*
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule, MatIconModule
} from '@angular/material';

import { StartComponent } from './start.component';
import { LiveComponent } from './live.component';
import { ButtonComponent } from './button.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule, 
    MatIconModule
  ],
  declarations: [
    StartComponent,
    LiveComponent,
    ButtonComponent
  ],
  exports: [
    StartComponent,
    LiveComponent,
    ButtonComponent
  ]
})
export class SectionsModule { }
