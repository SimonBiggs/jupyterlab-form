import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { 
  MatButtonModule, MatInputModule, MatIconModule
} from '@angular/material'

import { CodeComponent } from './code.component';

import { KernelService } from './kernel.service';
import { StartComponent } from './start.component';
import { LiveComponent } from './live.component';
import { ButtonComponent } from './button.component';
import { VariableComponent } from './variable.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule, MatInputModule, MatIconModule,
    FormsModule
  ],
  declarations: [
    CodeComponent,
    StartComponent,
    LiveComponent,
    ButtonComponent,
    VariableComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    CodeComponent,
    StartComponent,
    LiveComponent,
    ButtonComponent,
    VariableComponent
  ]
})
export class ScriptedFormElementsModule { }
