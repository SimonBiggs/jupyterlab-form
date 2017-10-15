import './polyfills';
import './styles';

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  InstanceTracker
} from '@jupyterlab/apputils';

import {
  FormWidget, FormWidgetFactory
} from './widget';

const FACTORY = 'Form';

function activate(app: JupyterLab, restorer: ILayoutRestorer) {  
  app.docRegistry.addFileType({
    name: 'form',
    mimeTypes: ['form'],
    extensions: ['.form.md', '.form'],
    contentType: 'file',
    fileFormat: 'text'
  })


  const services = app.serviceManager;
  const factory = new FormWidgetFactory({
    name: FACTORY,
    fileTypes: ['form'],
    defaultFor: ['form'],
    readOnly: true,
    services: services
  });

  let tracker = new InstanceTracker<FormWidget>({
    namespace: '@simonbiggs/jupyterlab-form'
  });

  restorer.restore(tracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: FACTORY }),
    name: widget => widget.context.path
  });

  app.docRegistry.addWidgetFactory(factory);
  let ft = app.docRegistry.getFileType('form');
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
    ILayoutRestorer
  ],
  activate: activate
};

export default extension;
