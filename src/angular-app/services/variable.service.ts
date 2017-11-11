/*
This will eventually be how the variables are saved.

Not yet implemented.
*/

import { Injectable } from '@angular/core';

// import { KernelService } from './kernel.service';

@Injectable()
export class VariableService {
  variableStore: { [key: string]: string | number } = {};

  constructor(
    // private myKernelSevice: KernelService
  ) { }

  setVariable(variableName: string, variableContents: string | number) {
    this.variableStore[variableName] = variableContents;
    // console.log(this.variableStore);
  }
}
