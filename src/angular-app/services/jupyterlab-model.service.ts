import { Injectable } from '@angular/core';

import {
  IObservableString
 } from '@jupyterlab/coreutils';

 import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  FormModel
} from '../../jupyterlab-extension/model';

@Injectable()
export class JupyterlabModelService {
  formModel: FormModel
  modelReady = new PromiseDelegate<void>();
  template: IObservableString

  setModel(model: FormModel) {
    this.formModel = model;
    this.modelReady.resolve(undefined);
  }

  setTemplate(template: string) {
    this.formModel.setTemplate(template);
  }

  getTemplate() {
    return this.formModel.getTemplate();
  }
}
