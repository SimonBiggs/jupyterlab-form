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
  // FormResultsModel, 
  FormResultsModelFactory
} from './model';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  FileEditor
} from '@jupyterlab/fileeditor';

import {
  DockPanel
} from '@phosphor/widgets'

import {
  CodeMirrorEditor
} from '@jupyterlab/codemirror';

import {
  defaultFormContents
} from './default-form-contents';

// import {
//   DocumentManager
// } from '@jupyterlab/docmanager';

// import {
//   Contents
// } from '@jupyterlab/services';

const FORMFACTORY = 'Form';
// const FORMRESULTSFACTORY = 'FormResults'
const EDITORFACTORY = 'Editor';

function activate(app: JupyterLab, restorer: ILayoutRestorer, launcher: ILauncher | null) {  
  const services = app.serviceManager;

  app.docRegistry.addFileType({
    name: 'form',
    mimeTypes: ['text/markdown', 'text/form'],
    extensions: ['.form.md'],
    contentType: 'file',
    fileFormat: 'text'
  })

  app.docRegistry.addFileType({
    name: 'form-results',
    mimeTypes: ['json/form-results'],
    extensions: ['.results.json'],
    contentType: 'file',
    fileFormat: 'json'
  })
  
  const formWidgetFactory = new FormWidgetFactory({
    name: FORMFACTORY,
    fileTypes: ['form'],
    defaultFor: ['form'],
    readOnly: true,
    services: services
  });

  // const formResultsWidgetFactory = new formResultsWidgetFactory({
  //   name: FORMRESULTSFACTORY,
  //   modelName: 'form-results',
  //   fileTypes: ['form-results'],
  //   defaultFor: ['form-results'],
  //   // readOnly: true,
  //   services: services 
  // })

  let tracker = new InstanceTracker<FormWidget>({
    namespace: '@simonbiggs/jupyterlab-form'
  });

  restorer.restore(tracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: FORMFACTORY }),
    name: widget => widget.context.path
  });

  // app.docRegistry.addWidgetFactory(factory);
  let registry = app.docRegistry;
  registry.addModelFactory(new FormResultsModelFactory({}));

  registry.addWidgetFactory(formWidgetFactory);
  // registry.addCreator({
  //   name: 'form',
  //   fileType: 'form'
  //   // widgetName: 'form'
  // });


  let ft = app.docRegistry.getFileType('form');
  formWidgetFactory.widgetCreated.connect((sender, widget) => {
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
      return app.commands.execute('docmanager:open', {
        path: model.path, factory: EDITORFACTORY
      }).then((editor: FileEditor) => {
        let panelAny: any = editor.parent;
        let panel: DockPanel = panelAny;

        // panel.layout.removeWidget(editor)
        panel.addWidget(editor, {
          mode: 'split-left'
        })

        let codeMirrorAny: any = editor.editor;
        let codeMirror: CodeMirrorEditor = codeMirrorAny;

        return editor.ready.then(() => {
          codeMirror.doc.setValue(defaultFormContents)
        })

      }) 
      .then(() => {
        let formDisplayPromise = app.commands.execute('docmanager:open', {
          path: model.path, factory: FORMFACTORY
        })

        formDisplayPromise.then(() => {

        })

        return formDisplayPromise
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
