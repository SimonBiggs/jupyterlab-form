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

  initialiseVariableComponent(component: VariableComponent) {
    const variableName = component.variableName
    this.componentStore[variableName] = component
    
    const variableReference = component.pythonVariableReference();
    this.appendToFetchAllCode(variableName, variableReference);
  }

  appendToFetchAllCode(variableName: string, variableReference: string) {
    let fetchCode = this.createFetchCode(variableReference);
    let fetchAllCodeAppend = `print(',"${variableName}":')
${fetchCode}`

    this.fetchAllCode = this.fetchAllCode.concat(fetchAllCodeAppend)
  }

  createFetchCode(variableReference: string): string {
    // let variableReference: string

    // if (isPandas) {
    //   variableReference = variableName.concat(".to_json(orient='table')")
      
    // } else {
    //   variableReference = `json.dumps(str(${variableName}))`
    // }

    let fetchCode = `
try:
    print('{{ "defined": true, "value": {} }}'.format(${variableReference}))
except:
    print('{"defined": false}')
`;
    return fetchCode;
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
        // if (name == 'world') {
        //   console.log(stringify(this.oldVariableStore[name]))
        //   console.log(stringify(this.variableStore[name]))
        // }

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



  pythonPushVariable(variableName: string, valueReference: string) {

    let pushCode = `${variableName} = ${valueReference}`

    // console.log(pushCode)
    this.oldVariableStore[variableName] = {
      defined: true,
      value: JSON.parse(JSON.stringify(valueReference))
    }
    return this.pushVariable(variableName, pushCode)
  }

  pushVariable(variableName: string, pushCode: string) {
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
