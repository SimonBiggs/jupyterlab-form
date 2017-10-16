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

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  FileEditor
} from '@jupyterlab/fileeditor';

import {
  DockPanel
} from '@phosphor/widgets'

// import {
//   DocumentManager
// } from '@jupyterlab/docmanager';

// import {
//   Contents
// } from '@jupyterlab/services';

const FACTORY = 'Form';
const EDITORFACTORY = 'Editor';

function activate(app: JupyterLab, restorer: ILayoutRestorer, launcher: ILauncher | null) {  
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

  // app.docRegistry.addWidgetFactory(factory);
  let registry = app.docRegistry;
  // registry.addModelFactory(new NotebookModelFactory({}));
  registry.addWidgetFactory(factory);
  registry.addCreator({
    name: 'form',
    fileType: 'text'
    // widgetName: 'form'
  });


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

  let callback = (cwd: string, name: string) => {
    return app.commands.execute(
      'docmanager:new-untitled', { path: cwd, type: 'file', ext: 'form.md' }
    ).then(model => {
      console.log(model)
      app.commands.execute('docmanager:open', {
        path: model.path, factory: EDITORFACTORY
      }).then((editor: FileEditor) => {
        let panelAny: any = editor.parent;
        let panel: DockPanel = panelAny;

        panel.layout.removeWidget(editor)

        panel.addWidget(editor, {
          mode: 'split-left'
        })
      }) 
      return app.commands.execute('docmanager:open', {
        path: model.path, factory: FACTORY
      });
    });
  };

  if (launcher) {
    launcher.add({
      displayName: 'Form',
      callback: callback
    })
  }
}

const extension: JupyterLabPlugin<void> = {
  id: '@simonbiggs/jupyterlab-form',
  autoStart: true,
  requires: [
    ILayoutRestorer
  ],
  optional: [
    ILauncher
  ],
  activate: activate
};

export default extension;
