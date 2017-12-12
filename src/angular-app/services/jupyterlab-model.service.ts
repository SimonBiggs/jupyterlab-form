import { Injectable } from '@angular/core';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  IObservableString
 } from '@jupyterlab/observables';

 import {
  PromiseDelegate
} from '@phosphor/coreutils';

@Injectable()
export class JupyterlabModelService {
  model: DocumentRegistry.IModel
  modelReady = new PromiseDelegate<void>();
  template: IObservableString

  setModel(model: DocumentRegistry.IModel) {
    this.model = model;
    this.template = this.model.modelDB.get('template') as IObservableString;

    this.modelReady.resolve(undefined);
  }

  setTemplate(template: string) {
    // console.log(template)
    this.template.clear()
    this.template.insert(0, template);

    // console.log(this.template.text)
  }

  getTemplate() {
    return this.template.text
  }
}
