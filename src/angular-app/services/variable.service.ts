/*
This will eventually be how the variables are saved.

Not yet implemented.
*/

import {
  Kernel
} from '@jupyterlab/services';

import * as  stringify from 'json-stable-stringify';

import { Injectable } from '@angular/core';
import { KernelService } from './kernel.service';

import { VariableStore } from '../interfaces/variable-store'
import { VariableValue } from '../types/variable-value';
// import { PandasTable } from '../interfaces/pandas-table'

import { VariableComponent } from '../types/variable-component';
// import { NumberComponent } from '../variables-module/number.component';
// import { StringComponent } from '../variables-module/string.component';
// import { TableComponent } from '../variables-module/table.component';


@Injectable()
export class VariableService {
  variableStore: VariableStore;
  oldVariableStore: VariableStore;

  componentStore: {
    [key: string]: VariableComponent
  } = {}

  fetchAllCodeStart: string = `print('{"version": "0.1.0"')
`
  fetchAllCode: string = ''
  fetchAllCodeEnd: string = `
print('}')`

  constructor(
    private myKernelSevice: KernelService
  ) { }

  setVariable(variableName: string, variableContents: VariableValue) {
    // this.variableStore[variableName] = variableContents;
    // console.log(this.variableStore);
  }

  initialiseVariableComponent(component: VariableComponent, variableName: string, isPandas: boolean) {
    this.componentStore[variableName] = component
    this.appendToFetchAllCode(variableName, isPandas);
  }

  appendToFetchAllCode(variableName: string, isPandas: boolean) {
    let fetchCode = this.createFetchCode(variableName, isPandas);
    let fetchAllCodeAppend = `print(',"${variableName}":')
${fetchCode}`

    this.fetchAllCode = this.fetchAllCode.concat(fetchAllCodeAppend)
  }

  fetchAll() {
    this.myKernelSevice.runCode(
      this.fetchAllCodeStart.concat(this.fetchAllCode, this.fetchAllCodeEnd), 
      '"fetchAllVariables"')
    .then((future: Kernel.IFuture) => {
      future.onIOPub = ((msg) => {
        if (msg.content.text) {
          let result = JSON.parse(String(msg.content.text))
          this.variableStore = result
          // console.log(this.variableStore)
          this.checkForChanges()
        }

      }); 
      
    })
  }

  checkForChanges() {
    const variableNames = Object.keys(this.componentStore);

    for (let name of variableNames) {
      if (this.variableStore[name].defined) {
        // console.log(this.variableStore[name].value)
        if (this.oldVariableStore) {
          if (stringify(this.variableStore[name]) != stringify(this.oldVariableStore[name])) {
            this.updateComponentView(
              this.componentStore[name], this.variableStore[name].value)
            
          }
        } else {
          this.updateComponentView(
            this.componentStore[name], this.variableStore[name].value)
        } 
      }
    }
    this.oldVariableStore = JSON.parse(JSON.stringify(this.variableStore));
  }

  updateComponentView(component: any, value: VariableValue) {
    // console.log(value)
    component.updateVariableView(value)
  }

  createFetchCode(variableName: string, isPandas: boolean): string {
    let variableReference: string
    let pythonFormatSection: string

    if (isPandas) {
      variableReference = variableName.concat(".to_json(orient='table')")
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
    return fetchCode;
  }

  pythonPullVariable(variableName: string, isPandas = false): Promise<Kernel.IFuture> {
    let fetchCode = this.createFetchCode(variableName, isPandas);

    let futurePromise = this.pullVariable(variableName, fetchCode);
    futurePromise.then(future => {
      future.onIOPub = ((msg: any) => {
        if (msg.content.name === 'stdout') {
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

  pythonPushVariable(variableName: string, variableValue: VariableValue, isPandas = false) {
    let valueReference: string

    if (isPandas) {
      // valueReference = `pd.read_json('${JSON.stringify(variableValue)}', orient='table')`
      valueReference = `json_table_to_df('${JSON.stringify(variableValue)}')`
      
    } else if (typeof(variableValue) === 'string') {
      variableValue = variableValue.replace(/\"/g, '\\"')
      valueReference = `"${String(variableValue)}"`
    } else if (typeof(variableValue) === 'number') {
      valueReference = `${String(variableValue)}`
    } else {
      throw RangeError("Unexpected variable type")
    }    

    let pushCode = `${variableName} = ${valueReference}`

    // console.log(pushCode)

    return this.pushVariable(variableName, variableValue, pushCode)
  }

  pushVariable(variableName: string, variableValue: VariableValue, pushCode: string) {
    return this.myKernelSevice.runCode(
      pushCode, '"push"_"' + variableName + '"'
    ).then(future => {
      // console.log(future)
      if (future) {
        this.setVariable(variableName, variableValue);
        return future.done;
      } else {
        return Promise.resolve('ignore');
      }
    })
  }
}
