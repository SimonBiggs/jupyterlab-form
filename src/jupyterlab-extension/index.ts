/*
The JupyterLab extension entry point.
*/


// import '../angular-app/polyfills';
import './styles';
import 'hammerjs';

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
  OpenFormTemplateWidget, OpenFormTemplateWidgetFactory,
  OpenFormResultsWidget,
  OpenFormResultsWidgetFactory
} from './widget';

import {
  // FormResultsModel,
  FormModelFactory, 
  // FormModel
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
  DockPanel, Widget
} from '@phosphor/widgets';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

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
  const openFormTemplateWidgetFactory = new OpenFormTemplateWidgetFactory({
    name: formTemplateFactoryName,
    fileTypes: ['form-template'],
    defaultFor: ['form-template'],
    readOnly: true,
    services: services
  });

  const openFormResultsWidgetFactory = new OpenFormResultsWidgetFactory({
    name: formResultsFactoryName,
    modelName: 'form-results',
    fileTypes: ['form-results'],
    defaultFor: ['form-results'],
    services: services,
  });

  // Register factories
  registry.addModelFactory(new FormModelFactory({}));
  registry.addWidgetFactory(openFormTemplateWidgetFactory);
  registry.addWidgetFactory(openFormResultsWidgetFactory);

  // Set up the trackers
  const formTemplateTracker = new InstanceTracker<OpenFormTemplateWidget>({
    namespace: '@simonbiggs/jupyterlab-form/open-form-template'
  });

  const formResultsTracker = new InstanceTracker<OpenFormResultsWidget>({
    namespace: '@simonbiggs/jupyterlab-form/open-form-results'
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
  openFormTemplateWidgetFactory.widgetCreated.connect((sender, widget) => {
    formTemplateTracker.add(widget);
    widget.context.pathChanged.connect(() => { formTemplateTracker.save(widget); });
  });

  openFormResultsWidgetFactory.widgetCreated.connect((sender, widget) => {
    formResultsTracker.add(widget);
    widget.context.pathChanged.connect(() => { formResultsTracker.save(widget); });
  });



  // Launcher
  const callback = (cwd: string, name: string) => {
    return app.commands.execute(
      'docmanager:new-untitled', { path: cwd, type: 'file', ext: formTemplateFileExt }
    )
    .then((editorModel: Contents.IModel) => {
      // console.log(formModel)
      return app.commands.execute('docmanager:open', {
        path: editorModel.path, factory: editorFactoryName
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
        let formWidgetPromise = new PromiseDelegate<Widget>()

        // The \d is a workaround for https://github.com/jupyterlab/jupyterlab/issues/3113
        // let baseName = editorModel.path.match(/^(.*)\.form\d*\.md$/)[1]
        let extensionMatch = editorModel.path.match(/^(.*)\.form*\.md$/)

        if (extensionMatch === null) {
          throw RangeError("The created form does not have the extension '.form.md'")
        }

        let baseName = editorModel.path.match(/^(.*)\.form*\.md$/)[1]
        let resultsName = baseName.concat(formResutsFileExt)

        // docManager.createNew(resultsName, FORMRESULTSFACTORY)
        let getResultsFilePromise = services.contents.get(resultsName, { content: false })
        getResultsFilePromise.then((formContentModel: Contents.IModel) => {
          app.commands.execute('docmanager:open', {
            path: formContentModel.path, factory: formResultsFactoryName
          }).then(widget => {
            formWidgetPromise.resolve(widget)
          });
        })

        getResultsFilePromise.catch(() => {
          services.contents.newUntitled({
            path: cwd,
            ext: formResutsFileExt,
            type: 'file'
          }).then((formContentModel: Contents.IModel) => {
            console.log()
            return docManager.rename(formContentModel.path, resultsName)
          })
          .then((formContentModel: Contents.IModel) => {
            app.commands.execute('docmanager:open', {
              path: formContentModel.path, factory: formResultsFactoryName
            }).then(widget => {
              formWidgetPromise.resolve(widget)
            })
          })
        })

        return formWidgetPromise.promise;


        // return app.commands.execute('docmanager:open', {
        //   path: editorModel.path, factory: formTemplateFactoryName
        // });


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
