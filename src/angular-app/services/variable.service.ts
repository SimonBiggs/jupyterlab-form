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

import { VariableComponent } from '../types/variable-component';


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

  resetVariableService() {
    this.variableStore = {};
    this.oldVariableStore = {};
    this.componentStore = {};
    this.fetchAllCode = '';
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
        if (name == 'world') {
          console.log(stringify(this.oldVariableStore[name]))
          console.log(stringify(this.variableStore[name]))
        }

        if (this.oldVariableStore) {
          if (stringify(this.variableStore[name]) != stringify(this.oldVariableStore[name])) {
            // this.oldVariableStore[name] = JSON.parse(JSON.stringify(this.variableStore[name]))
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
    // console.log('update view')
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
    } else if (typeof(variableValue) === 'boolean') {
      if (variableValue) {
        valueReference = 'True'
      } else {
        valueReference = 'False'
      }
    } else {
      console.log(variableValue)
      throw RangeError("Unexpected variable type")
    }    

    let pushCode = `${variableName} = ${valueReference}`

    // console.log(pushCode)
    this.oldVariableStore[variableName] = {
      defined: true,
      value: JSON.parse(JSON.stringify(valueReference))
    }
    return this.pushVariable(variableName, variableValue, pushCode)
  }

  pushVariable(variableName: string, variableValue: VariableValue, pushCode: string) {
    return this.myKernelSevice.runCode(
      pushCode, '"push"_"' + variableName + '"'
    ).then(future => {
      // console.log(future)
      if (future) {
        return future.done;
      } else {
        return Promise.resolve('ignore');
      }
    })
  }
}
