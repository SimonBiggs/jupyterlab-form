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
  ServiceManager
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

const RENDER_TIMEOUT = 1000;

export
class BaseFormWidget extends AngularWidget<AppComponent, AppModule> implements DocumentRegistry.IReadyWidget {
  _context: DocumentRegistry.Context;
  _services: ServiceManager;

  constructor(options: FormWidget.IOptions) {
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
class FormWidget extends BaseFormWidget {
  private _monitor: ActivityMonitor<any, any> | null = null;

  constructor(options: FormWidget.IOptions) {
    super(options);

    this.id = '@simonbiggs/jupyterlab-form';

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
class FormResultsWidget extends BaseFormWidget {
    constructor(options: FormWidget.IOptions) {
      super(options);
  
      this.id = '@simonbiggs/jupyterlab-form-results';
  
      this.componentReady.promise.then(() => {
        this._context.ready.then(() => {
          this.setFormContents()
        })
      })
    }
  
    setFormContents() {
      // Need to get the content from the frozen form

      // let content = ...
      // let results = this._context.model
      // this.ngZone.run(() => {
      //   this.componentInstance.setFormContents(content);
        // this.componentInstance.setFormResults(results);
      // });
    }
};


export
namespace FormWidget {
  export
  interface IOptions {
    context: DocumentRegistry.Context,
    services: ServiceManager
  }
}

export
namespace FormWidgetFactory {
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    services: ServiceManager
  }
}

export
class FormWidgetFactory extends ABCWidgetFactory<FormWidget, DocumentRegistry.IModel> {
  services: ServiceManager

  constructor(options: FormWidgetFactory.IOptions) {
    super(options);
    this.services = options.services;
    // options.modelName
  }

  protected createNewWidget(context: DocumentRegistry.Context): FormWidget {
    return new FormWidget({
      context: context, 
      services: this.services 
    });
  }
}



export
class FormResultsWidgetFactory extends ABCWidgetFactory<FormResultsWidget, DocumentRegistry.IModel> {
  services: ServiceManager

  constructor(options: FormWidgetFactory.IOptions) {
    super(options);
    this.services = options.services;
    // options.modelName
  }

  protected createNewWidget(context: DocumentRegistry.Context): FormResultsWidget {
    return new FormResultsWidget({
      context: context, 
      services: this.services 
    });
  }
}