// jupyterlab-form
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination.

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the Apache-2.0 and the AGPL-3.0+ for the specific language governing 
// permissions and limitations under the License.

import { Injectable } from '@angular/core';

import {
  IObservableString
 } from '@jupyterlab/observables';

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
