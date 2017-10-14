import './polyfills';
import './styles';

import {
  JSONExt
} from '@phosphor/coreutils';

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
  FormWidget
} from './widget';


function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  let widget: FormWidget

  let tracker = new InstanceTracker<FormWidget>({
    namespace: 'form'
  });

  const demoCommand: string = 'form:demo';
  
  app.commands.addCommand(demoCommand, {
    label: 'Demo Form',
    execute: () => {
      if(!widget) {
        widget = new FormWidget();
      }
      if(!tracker.has(widget)) {
        tracker.add(widget);
      }
      if(!widget.isAttached) {
        app.shell.addToMainArea(widget);
      }
      app.shell.activateById(widget.id);
    }
  });

  palette.addItem({command: demoCommand, category: 'Form'})

  restorer.restore(tracker, {
    command: demoCommand,
    args: () => JSONExt.emptyObject,
    name: () => 'Demo Form'
  })
}

const extension: JupyterLabPlugin<void> = {
  id: 'form',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
