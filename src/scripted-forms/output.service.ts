import { Injectable } from '@angular/core';

import { IOutputAreaModel } from '@jupyterlab/outputarea';

@Injectable()
export class OutputService {
  outputStore: { [key:string]: IOutputAreaModel } = {};

  setOutput(outputName: string, outputJSON: IOutputAreaModel) {
    this.outputStore[outputName] = outputJSON;
    // console.log(this.outputStore);
  }
}