/*
This will eventually be how the outputs are saved.

Not yet implemented.
*/

import { Injectable } from '@angular/core';

import { IOutputAreaModel } from '@jupyterlab/outputarea';

@Injectable()
export class OutputService {
  outputStore: { [key: string]: IOutputAreaModel } = {};

  setOutput(outputName: string, outputModel: IOutputAreaModel) {
    this.outputStore[outputName] = outputModel;
    // console.log(this.outputStore);
  }
}
