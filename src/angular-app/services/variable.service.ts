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
    const variableIdentifier = component.variableIdentifier
    this.componentStore[variableIdentifier] = component
    
    const variableReference = component.pythonVariableReference();
    this.appendToFetchAllCode(variableIdentifier, variableReference);
  }

  appendToFetchAllCode(variableIdentifier: string, variableReference: string) {
    let fetchCode = this.createFetchCode(variableReference);
    let fetchAllCodeAppend = `print(',"${variableIdentifier}":')
${fetchCode}`

    this.fetchAllCode = this.fetchAllCode.concat(fetchAllCodeAppend)
  }

  createFetchCode(variableReference: string): string {
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
      if (future) {
        let textContent = '';
        future.onIOPub = (msg => {
          if (msg.content.text) {
            textContent = textContent.concat(String(msg.content.text))
            try {
              let result = JSON.parse(textContent)
              this.variableStore = result
              this.checkForChanges()
            } catch (err) {
              console.log(textContent)
            }
          }
        }); 
      }
    })
  }

  checkForChanges() {
    const variableIdentifiers = Object.keys(this.componentStore);

    for (let identifier of variableIdentifiers) {
      if (this.variableStore[identifier].defined) {
        if (this.oldVariableStore) {
          if (stringify(this.variableStore[identifier]) != stringify(this.oldVariableStore[identifier])) {
            this.updateComponentView(
              this.componentStore[identifier], this.variableStore[identifier].value)
          }
        } else {
          this.updateComponentView(
            this.componentStore[identifier], this.variableStore[identifier].value)
        } 
      }
    }
    this.oldVariableStore = JSON.parse(JSON.stringify(this.variableStore));
  }

  updateComponentView(component: any, value: VariableValue) {
    component.updateVariableView(value);
  }

  pushVariable(variableIdentifier: string, variableName: string, valueReference: string) {
    let pushCode = `${variableName} = ${valueReference}`
    
    this.oldVariableStore[variableIdentifier] = {
      defined: true,
      value: JSON.parse(JSON.stringify(valueReference))
    }

    return this.myKernelSevice.runCode(
      pushCode, '"push"_"' + variableIdentifier + '"'
    ).then(future => {
      // console.log(future)
      if (future) {
        const promise = future.done
        future.done.then(() => {
          this.fetchAll();
        })
        return promise;
      } else {
        return Promise.resolve('ignore');
      }
    })
  }
}
