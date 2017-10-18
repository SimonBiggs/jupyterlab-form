import {
  AngularWidget
} from './angular-loader';

import {
  AppComponent
} from './app.component';
  
import {
  AppModule
} from './app.module';

import {
  IObservableString
 } from '@jupyterlab/coreutils';

import {
  ServiceManager, ContentsManager, Contents
} from '@jupyterlab/services';

import {
  ActivityMonitor, 
  PathExt
} from '@jupyterlab/coreutils';

import {
  ABCWidgetFactory, DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  Message
} from '@phosphor/messaging';

import {
  IDocumentManager
} from '@jupyterlab/docmanager';

const RENDER_TIMEOUT = 1000;


export
namespace BaseFormWidget {
  export
  interface IOptions {
    context: DocumentRegistry.Context,
    services: ServiceManager
  }
}


export
class BaseFormWidget extends AngularWidget<AppComponent, AppModule> implements DocumentRegistry.IReadyWidget {
  _context: DocumentRegistry.Context;
  _services: ServiceManager;

  constructor(options: BaseFormWidget.IOptions) {
    super(AppComponent, AppModule);

    this.title.closable = true;
    this.addClass('jp-formWidgets');

    this._context = options.context;
    this._services = options.services;

    this.title.label = PathExt.basename(this._context.path);
    this._context.pathChanged.connect(this._onPathChanged, this);

    this.componentReady.promise.then(() => {
      this.ngZone.run(() => {
        this.componentInstance.sessionConnect(
          this._services, this._context.path);
      });
    })
  }

  get ready() {
    return Promise.resolve();
  }

  dispose(): void {
    this.ngZone.run(() => {
      this.componentRef.destroy();
    });
    super.dispose();
  }

  get context(): DocumentRegistry.Context {
    return this._context;
  }

  private _onPathChanged(): void {
    this.title.label = PathExt.basename(this._context.path);
    this.ngZone.run(() => {
      this.componentInstance.pathChanged(this._context.path);
    });
  }

  protected onActivateRequest(msg: Message): void {
    this.node.tabIndex = -1;
    this.node.focus();
  }
}


export
class FormTemplateWidget extends BaseFormWidget {
  private _monitor: ActivityMonitor<any, any> | null = null;

  constructor(options: BaseFormWidget.IOptions) {
    super(options);

    this.id = '@simonbiggs/jupyterlab-form/template';

    this.componentReady.promise.then(() => {
      this._context.ready.then(() => {
        this.setFormContents()
        this._monitor = new ActivityMonitor({
          signal: this._context.model.contentChanged,
          timeout: RENDER_TIMEOUT
        });
        this._monitor.activityStopped.connect(this.setFormContents, this);
      })
    })
  }

  setFormContents() {
    let content = this._context.model.toString();
    this.ngZone.run(() => {
      this.componentInstance.setFormContents(content);
    });
  }

  dispose(): void {
    if (this._monitor) {
      this._monitor.dispose();
    }
    super.dispose();
  }
}


export
namespace FormResultsWidget {
  export
  interface IOptions {
    context: DocumentRegistry.Context,
    services: ServiceManager,
    docManager: IDocumentManager
  }
}

export 
class FormResultsWidget extends BaseFormWidget {
  private _docManager: IDocumentManager
  contentsManager = new ContentsManager()

  constructor(options: FormResultsWidget.IOptions) {
    super(options);

    this._docManager = options.docManager;

    this.id = '@simonbiggs/jupyterlab-form/results';

    this.componentReady.promise.then(() => {
      this._context.ready.then(() => {
        this.setFormContents()
      })
    })
  }
  
  setFormContents() {
    // Need to get the content from the frozen form

    let formPath = this._context.model.modelDB.get('formPath') as IObservableString
    // let results = this._context.model

    this.contentsManager.get(formPath.text)      
    .then((templateModel: Contents.IModel) => {
      this.ngZone.run(() => {
        this.componentInstance.setFormContents(templateModel.content);
        // this.componentInstance.setFormResults(results);
      });
    })
  }
};



export
namespace FormTemplateWidgetFactory {
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    services: ServiceManager
  }
}

export
class FormTemplateWidgetFactory extends ABCWidgetFactory<FormTemplateWidget, DocumentRegistry.IModel> {
  services: ServiceManager

  constructor(options: FormTemplateWidgetFactory.IOptions) {
    super(options);
    this.services = options.services;
    // options.modelName
  }

  protected createNewWidget(context: DocumentRegistry.Context): FormTemplateWidget {
    return new FormTemplateWidget({
      context: context, 
      services: this.services 
    });
  }
}


export
namespace FormResultsWidgetFactory {
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    services: ServiceManager,
    docManager: IDocumentManager
  }
}


export
class FormResultsWidgetFactory extends ABCWidgetFactory<FormResultsWidget, DocumentRegistry.IModel> {
  services: ServiceManager
  docManager: IDocumentManager

  constructor(options: FormResultsWidgetFactory.IOptions) {
    super(options);
    this.services = options.services;
    this.docManager = options.docManager
    // options.modelName
  }

  protected createNewWidget(context: DocumentRegistry.Context): FormResultsWidget {
    return new FormResultsWidget({
      context: context, 
      services: this.services,
      docManager: this.docManager
    });
  }
}