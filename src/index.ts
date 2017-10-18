import './polyfills';
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
  FormWidget, FormWidgetFactory,
  // FormResultsWidget, 
  FormResultsWidgetFactory
} from './widget';

import {
  // FormResultsModel, 
  FormModelFactory
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
const FORMRESULTSFACTORY = 'FormResults'
const EDITORFACTORY = 'Editor';

const FORM_EXTENSION = '.form.md';
const RESULT_EXTENSION = '.form.json'

function activate(app: JupyterLab, restorer: ILayoutRestorer, docManager: IDocumentManager, launcher: ILauncher | null) {  
  const services = app.serviceManager;

  app.docRegistry.addFileType({
    name: 'form',
    mimeTypes: ['text/markdown'],
    extensions: [FORM_EXTENSION],
    contentType: 'file',
    fileFormat: 'text'
  })

  app.docRegistry.addFileType({
    name: 'form-results',
    mimeTypes: ['application/x-form+json'],
    extensions: [RESULT_EXTENSION],
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

  const formResultsWidgetFactory = new FormResultsWidgetFactory({
    name: FORMRESULTSFACTORY,
    modelName: 'form-results',
    fileTypes: ['form-results'],
    defaultFor: ['form-results'],
    // readOnly: true,
    services: services,
    docManager: docManager
  })

  // console.log(app.commands);

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
  registry.addModelFactory(new FormModelFactory({}));

  registry.addWidgetFactory(formWidgetFactory);
  registry.addWidgetFactory(formResultsWidgetFactory);
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
      'docmanager:new-untitled', { path: cwd, type: 'file', ext: FORM_EXTENSION }
    ).then((formModel: Contents.IModel) => {
      // console.log(formModel)
      return app.commands.execute('docmanager:open', {
        path: formModel.path, factory: EDITORFACTORY
      }).then((editor: FileEditor) => {
        let panelAny: any = editor.parent;
        let panel: DockPanel = panelAny;

        // console.log(formModel.path)

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
        return app.commands.execute('docmanager:open', {
          path: formModel.path, factory: FORMFACTORY
        })

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
    })
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
