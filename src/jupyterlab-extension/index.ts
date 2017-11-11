/*
The JupyterLab extension entry point.
*/


// import '../angular-app/polyfills';
import './styles';

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  Contents
} from '@jupyterlab/services';

import {
  InstanceTracker
} from '@jupyterlab/apputils';

import {
  FormTemplateWidget, FormTemplateWidgetFactory,
  FormResultsWidget,
  FormResultsWidgetFactory
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
  IDocumentManager
} from '@jupyterlab/docmanager';

import {
  DockPanel
} from '@phosphor/widgets';

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

const formTemplateFactoryName = 'Form Template';
const formResultsFactoryName = 'Form Results';
const editorFactoryName = 'Editor';

const formTemplateFileExt = '.form.md';
const formResutsFileExt = '.form.json';

function activate(app: JupyterLab, restorer: ILayoutRestorer, docManager: IDocumentManager, launcher: ILauncher | null) {  
  const services = app.serviceManager;
  const registry = app.docRegistry;

  // Add new file types
  app.docRegistry.addFileType({
    name: 'form-template',
    mimeTypes: ['text/markdown'],
    extensions: [formTemplateFileExt],
    contentType: 'file',
    fileFormat: 'text'
  });

  app.docRegistry.addFileType({
    name: 'form-results',
    mimeTypes: ['application/x-form+json'],
    extensions: [formResutsFileExt],
    contentType: 'file',
    fileFormat: 'json'
  });

  // Define the widget factories
  const formTemplateWidgetFactory = new FormTemplateWidgetFactory({
    name: formTemplateFactoryName,
    fileTypes: ['form-template'],
    defaultFor: ['form-template'],
    readOnly: true,
    services: services
  });

  const formResultsWidgetFactory = new FormResultsWidgetFactory({
    name: formResultsFactoryName,
    modelName: 'form-results',
    fileTypes: ['form-results'],
    defaultFor: ['form-results'],
    services: services,
    docManager: docManager
  });

  // Register factories
  registry.addModelFactory(new FormResultsModelFactory({}));
  registry.addWidgetFactory(formTemplateWidgetFactory);
  registry.addWidgetFactory(formResultsWidgetFactory);

  // Set up the trackers
  const formTemplateTracker = new InstanceTracker<FormTemplateWidget>({
    namespace: '@simonbiggs/jupyterlab-form/template'
  });

  const formResultsTracker = new InstanceTracker<FormResultsWidget>({
    namespace: '@simonbiggs/jupyterlab-form/results'
  });

  // Set up state restorers
  restorer.restore(formTemplateTracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: formTemplateFactoryName }),
    name: widget => widget.context.path
  });

  restorer.restore(formResultsTracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: formResultsFactoryName }),
    name: widget => widget.context.path
  });

  // Connect the trackers
  formTemplateWidgetFactory.widgetCreated.connect((sender, widget) => {
    formTemplateTracker.add(widget);
    widget.context.pathChanged.connect(() => { formTemplateTracker.save(widget); });
  });

  formResultsWidgetFactory.widgetCreated.connect((sender, widget) => {
    formResultsTracker.add(widget);
    widget.context.pathChanged.connect(() => { formResultsTracker.save(widget); });
  });



  // Launcher
  const callback = (cwd: string, name: string) => {
    return app.commands.execute(
      'docmanager:new-untitled', { path: cwd, type: 'file', ext: formTemplateFileExt }
    ).then((formModel: Contents.IModel) => {
      // console.log(formModel)
      return app.commands.execute('docmanager:open', {
        path: formModel.path, factory: editorFactoryName
      }).then((editor: FileEditor) => {
        const panelAny: any = editor.parent;
        const panel: DockPanel = panelAny;

        // console.log(formModel.path)

        // panel.layout.removeWidget(editor)
        panel.addWidget(editor, {
          mode: 'split-left'
        });

        const codeMirrorAny: any = editor.editor;
        const codeMirror: CodeMirrorEditor = codeMirrorAny;

        return editor.ready.then(() => {
          codeMirror.doc.setValue(defaultFormContents);
        });

      })
      .then(() => {
        return app.commands.execute('docmanager:open', {
          path: formModel.path, factory: formTemplateFactoryName
        });

        // The \d is a workaround for https://github.com/jupyterlab/jupyterlab/issues/3113
        // let baseName = formModel.path.match(/^(.*)\.form\d*\.md$/)[1]
        // let extensionMatch = formModel.path.match(/^(.*)\.form*\.md$/)

        // if (extensionMatch === null) {
        //   throw RangeError("The created form does not have the extension '.form.md'")
        // }

        // let baseName = formModel.path.match(/^(.*)\.form*\.md$/)[1]
        // let resultsName = baseName.concat(RESULT_EXTENSION)

        // // docManager.createNew(resultsName, FORMRESULTSFACTORY)
        // let getResultsFilePromise = docManager.services.contents.get(resultsName, { content: false })

        // getResultsFilePromise.then((resultsModel: Contents.IModel) => {
        //   return app.commands.execute('docmanager:open', {
        //     path: resultsModel.path, factory: FORMRESULTSFACTORY
        //   })
        // })

        // getResultsFilePromise.catch(() => {
        //   docManager.services.contents.newUntitled({
        //     path: cwd,
        //     ext: RESULT_EXTENSION,
        //     type: 'file'
        //   })
        //   .then((resultsModel: Contents.IModel) => {
        //     return app.commands.execute('docmanager:open', {
        //       path: resultsModel.path, factory: FORMRESULTSFACTORY
        //     })
        //   })
        // })

      });
    });
  };

  if (launcher) {
    launcher.add({
      displayName: 'Form',
      callback: callback
    });
  }
}

const extension: JupyterLabPlugin<void> = {
  id: '@simonbiggs/jupyterlab-form',
  autoStart: true,
  requires: [
    ILayoutRestorer,
    IDocumentManager
  ],
  optional: [
    ILauncher
  ],
  activate: activate
};

export default extension;
