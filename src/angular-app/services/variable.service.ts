/*
This will eventually be how the variables are saved.

Not yet implemented.
*/

import {
  Kernel
} from '@jupyterlab/services';

import { Injectable } from '@angular/core';
import { KernelService } from './kernel.service';

@Injectable()
export class VariableService {
  variableStore: { [key: string]: string | number | JSON } = {};

  constructor(
    private myKernelSevice: KernelService
  ) { }

  setVariable(variableName: string, variableContents: string | number | JSON) {
    this.variableStore[variableName] = variableContents;
    // console.log(this.variableStore);
  }

  pythonPullVariable(variableName: string, isPandas = false): Promise<Kernel.IFuture> {
    let variableReference: string
    let pythonFormatSection: string

    if (isPandas) {
      variableReference = variableName.concat(".to_json(orient='split')")
      pythonFormatSection = '{}'
      
    } else {
      variableReference = variableName
      pythonFormatSection = '"{}"'
    }

    let fetchCode = `
try:
    print('{{ "defined": true, "value": ${pythonFormatSection} }}'.format(${variableReference}))
except:
    print('{"defined": false}')
`;
    console.log(fetchCode)

    let futurePromise = this.pullVariable(variableName, fetchCode);
    futurePromise.then(future => {
      future.onIOPub = ((msg: any) => {
        if (msg.content.name === 'stdout') {
          console.log(msg.content.text)
          const result = JSON.parse(msg.content.text);
          if (result.defined) {
            this.setVariable(variableName, result.value);
          }
        }
      }); 
      
    })
    return futurePromise
  }

  pullVariable(variableName: string, fetchCode: string): Promise<Kernel.IFuture> {
    return this.myKernelSevice.runCode(fetchCode, '"pull"_"' + variableName + '"')
  }

  pythonPushVariable(variableName: string, variableValue: string | number | JSON, isPandas = false) {
    let valueReference: string

    if (isPandas) {
      valueReference = `pd.read_json(${String(variableValue)}, orient='split')`
    } else if (typeof(variableValue) === 'string') {
      variableValue = variableValue.replace(/\"/g, '\\"')
      valueReference = `"${String(variableValue)}"`
    } else if (typeof(variableValue) === 'number') {
      valueReference = `${String(variableValue)}`
    } else {
      throw RangeError("Unexpected variable type")
    }    

    let pushCode = `${variableName} = ${valueReference}`

    console.log(valueReference)

    return this.pushVariable(variableName, variableValue, pushCode)
  }

  pushVariable(variableName: string, variableValue: string | number | JSON, pushCode: string) {
    return this.myKernelSevice.runCode(
      pushCode, '"push"_"' + variableName + '"'
    ).then(future => {
      if (future) {
        this.setVariable(variableName, variableValue);
        return future.done;
      } else {
        return Promise.resolve('ignore');
      }
    })
  }
}
