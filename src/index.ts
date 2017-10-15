import './polyfills';
import './styles';

// import {
//   JSONExt
// } from '@phosphor/coreutils';

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  // ICommandPalette, 
  InstanceTracker
} from '@jupyterlab/apputils';

import {
  FormWidget, FormWidgetFactory
} from './widget';

const FACTORY = 'Form';


// function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
function activate(app: JupyterLab, restorer: ILayoutRestorer) {  
  const factory = new FormWidgetFactory({
    name: FACTORY,
    fileTypes: ['markdown'],
    readOnly: true
  });

  // let widget: FormWidget

  let tracker = new InstanceTracker<FormWidget>({
    namespace: '@simonbiggs/jupyterlab-form'
  });

  // const demoCommand: string = 'form:demo';
  
  // app.commands.addCommand(demoCommand, {
  //   label: 'Demo Form',
  //   execute: () => {
  //     if(!widget) {
  //       widget = new FormWidget();
  //     }
  //     if(!tracker.has(widget)) {
  //       tracker.add(widget);
  //     }
  //     if(!widget.isAttached) {
  //       app.shell.addToMainArea(widget);
  //     }
  //     app.shell.activateById(widget.id);
  //   }
  // });

  // palette.addItem({command: demoCommand, category: 'Form'})

  // restorer.restore(tracker, {
  //   command: demoCommand,
  //   args: () => JSONExt.emptyObject,
  //   name: () => 'Demo Form'
  // })

  restorer.restore(tracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: FACTORY }),
    name: widget => widget.context.path
  });

  app.docRegistry.addWidgetFactory(factory);
  let ft = app.docRegistry.getFileType('markdown');
  factory.widgetCreated.connect((sender, widget) => {
    // Track the widget.
    tracker.add(widget);
    // Notify the instance tracker if restore data needs to update.
    widget.context.pathChanged.connect(() => { tracker.save(widget); });

    if (ft) {
      widget.title.iconClass = ft.iconClass;
      widget.title.iconLabel = ft.iconLabel;
    }
  });
}

const extension: JupyterLabPlugin<void> = {
  id: '@simonbiggs/jupyterlab-form',
  autoStart: true,
  requires: [
    // ICommandPalette, 
    ILayoutRestorer
  ],
  activate: activate
};

export default extension;
