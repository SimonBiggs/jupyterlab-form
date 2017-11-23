/*
The jupyterlab-form widget.

Currently there are two exported widgets. A results widget and a template
widget. The thought is that eventually I will collapse this into one. As in
the form widget will always be the 'results' widget. I imagine this will become
clearer as I sort out the data model.
*/

import {
  BoxLayout, Widget
} from '@phosphor/widgets';

import {
  AngularWidget
} from '@simonbiggs/phosphor-angular-loader';

import {
  AppComponent
} from '../angular-app/app.component';

import {
  AppModule
} from '../angular-app/app.module';

import {
  // IObservableString
 } from '@jupyterlab/coreutils';

import {
  ServiceManager, ContentsManager, 
  // Contents
} from '@jupyterlab/services';

import {
  ActivityMonitor,
  PathExt
} from '@jupyterlab/coreutils';

import {
  ABCWidgetFactory, DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  // Message
} from '@phosphor/messaging';

import {
  // IDocumentManager
} from '@jupyterlab/docmanager';

import {
  FormModel
} from './model';

const RENDER_TIMEOUT = 1000;





// export
// class BaseFormWidget extends AngularWidget<AppComponent, AppModule> {
//   _context: DocumentRegistry.Context;
//   _services: ServiceManager;

//   constructor(options: BaseFormWidget.IOptions) {
//     super(AppComponent, AppModule);

//     this.title.closable = true;
//     this.addClass('jp-formWidgets');

//     this._context = options.context;
//     this._services = options.services;

//     this.title.label = PathExt.basename(this._context.path);
//     this._context.pathChanged.connect(this._onPathChanged, this);

//     this.componentReady.promise.then(() => {
//       this.ngZone.run(() => {
//         this.componentInstance.sessionConnect(
//           this._services, this._context.path);
//       });
//     })
//   }

//   get context(): DocumentRegistry.Context {
//     return this._context;
//   }

//   private _onPathChanged(): void {
//     this.title.label = PathExt.basename(this._context.path);
//     this.ngZone.run(() => {
//       this.componentInstance.pathChanged(this._context.path);
//     });
//   }

//   protected onActivateRequest(msg: Message): void {
//     this.node.tabIndex = -1;
//     this.node.focus();
//   }
// }

export
namespace FormWidget {
  export
  interface IOptions {
    context: DocumentRegistry.Context;
    services: ServiceManager;
  }
}

export
class FormWidget extends AngularWidget<AppComponent, AppModule> implements DocumentRegistry.IReadyWidget {
  contentsManager = new ContentsManager()
  _context: DocumentRegistry.Context;
  _services: ServiceManager;
  model: FormModel;

  constructor(options: FormWidget.IOptions) {
    super(AppComponent, AppModule);

    this._context = options.context;
    this._services = options.services;
    this.addClass('jp-Form');

    this.model = new FormModel({});

    this._context.pathChanged.connect(this._onPathChanged, this);

    this.id = '@simonbiggs/jupyterlab-form/form';

    this.run(() => {
      this.componentInstance.setDocumentModel(this.model);
      this.componentInstance.sessionConnect(
        this._services, this._context.path);
    })
  }

  updateTemplate(template: string) {
    this.run(() => {
      this.componentInstance.modelReady().then(() => {
        this.componentInstance.setTemplateAndBuildForm(template);
      })
    });
  }

  // pullTemplateFromFile() {
  //   const formPath = this._context.model.modelDB.get('formPath') as IObservableString;

  //   this.contentsManager.get(formPath.text)
  //   .then((templateModel: Contents.IModel) => {
  //     this.ngZone.run(() => {
  //       this.componentInstance.setTemplateAndBuildForm(templateModel.content);
  //       // this.componentInstance.setFormResults(results);
  //     });
  //   })
  // }

  get ready() {
    return Promise.resolve();
  }

  get context(): DocumentRegistry.Context {
    return this._context;
  }

  private _onPathChanged(): void {
    this.run(() => {
      this.componentInstance.pathChanged(this._context.path);
    });
  }
};


export
namespace OpenFormTemplateWidget {
  export
  interface IOptions {
    context: DocumentRegistry.Context;
    services: ServiceManager;
  }
}


export
class OpenFormTemplateWidget extends Widget implements DocumentRegistry.IReadyWidget{
  private _monitor: ActivityMonitor<any, any> | null = null;
  _context: DocumentRegistry.Context;
  _services: ServiceManager;
  form: FormWidget

  constructor(options: OpenFormTemplateWidget.IOptions) {
    super();

    this.id = '@simonbiggs/jupyterlab-form/open-form-template';

    this._context = options.context;
    this._services = options.services;

    this.addClass('jp-FormContainer');

    this.title.closable = true;

    this.title.label = PathExt.basename(this._context.path);
    this._context.pathChanged.connect(this._onPathChanged, this);

    let form = this.form = new FormWidget({
      context: this._context,
      services: this._services
    })

    let layout = this.layout = new BoxLayout();
    let toolbar = new Widget();
    toolbar.addClass('jp-Toolbar');

    layout.addWidget(toolbar);
    BoxLayout.setStretch(toolbar, 0);
    layout.addWidget(form);
    BoxLayout.setStretch(form, 1);

    this._context.ready.then(() => {
      this.updateTemplate();
      this._monitor = new ActivityMonitor({
        signal: this._context.model.contentChanged,
        timeout: RENDER_TIMEOUT
      });
      this._monitor.activityStopped.connect(this.updateTemplate, this);
    });
  }

  get ready() {
    return Promise.resolve();
  }

  get context(): DocumentRegistry.Context {
    return this._context;
  }

  private _onPathChanged(): void {
    this.title.label = PathExt.basename(this._context.path);
  }

  updateTemplate() {
    const content = this._context.model.toString();
    // console.log(content)
    this.form.updateTemplate(content);
  }

  dispose(): void {
    if (this._monitor) {
      this._monitor.dispose();
    }
    super.dispose();
  }
}


export
namespace OpenFormTemplateWidgetFactory {
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    services: ServiceManager;
  }
}

export
class OpenFormTemplateWidgetFactory extends ABCWidgetFactory<OpenFormTemplateWidget, DocumentRegistry.IModel> {
  services: ServiceManager;

  constructor(options: OpenFormTemplateWidgetFactory.IOptions) {
    super(options);
    this.services = options.services;
    // options.modelName
  }

  protected createNewWidget(context: DocumentRegistry.Context): OpenFormTemplateWidget {
    return new OpenFormTemplateWidget({
      context: context,
      services: this.services
    });
  }
}
