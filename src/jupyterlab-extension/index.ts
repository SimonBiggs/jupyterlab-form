/*
The JupyterLab extension entry point.
*/

import './styles';
import 'hammerjs';

import {
  JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ISettingRegistry
} from '@jupyterlab/coreutils';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  IDocumentManager
} from '@jupyterlab/docmanager';

import {
  activate
} from './activate';

const extension: JupyterLabPlugin<void> = {
  id: '@simonbiggs/jupyterlab-form:extension',
  autoStart: true,
  requires: [ILayoutRestorer, IDocumentManager, ISettingRegistry],
  optional: [ILauncher],
  activate: activate
};

export default extension;



