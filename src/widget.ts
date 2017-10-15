import {
  AngularWidget
} from './angular-loader';

import {
  DemoFormComponent
} from './demo-form/demo-form.component';
  
import {
  DemoFormModule
} from './demo-form.module';

// import {
//   PromiseDelegate
// } from '@phosphor/coreutils';

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
class FormWidget extends AngularWidget<DemoFormComponent> implements DocumentRegistry.IReadyWidget {
  private _context: DocumentRegistry.Context;
  private _monitor: ActivityMonitor<any, any> | null = null;
  waitingForForm = false;

  constructor(options: FormWidget.IOptions) {
    super(DemoFormModule, DemoFormComponent);
    this.id = '@simonbiggs/jupyterlab-form';
    this.title.closable = true;
    this.addClass('jp-scriptedFormWidget');

    this._context = options.context;
    this.title.label = PathExt.basename(this._context.path);
    this._context.pathChanged.connect(this._onPathChanged, this);

    this._context.ready.then(() => {
      this.updateFormContents()
      this._monitor = new ActivityMonitor({
        signal: this._context.model.contentChanged,
        timeout: RENDER_TIMEOUT
      });
      this._monitor.activityStopped.connect(this.updateFormContents, this);
    })
  }

  updateFormContents() {
    // this.formReady = false;
    let content = this._context.model.toString()
    this.componentReady.promise.then(() => {
      if (!this.waitingForForm) {
        this.componentRef.instance.setFormContents(content)
        this.waitingForForm = true;
        this.componentRef.instance.formReady.promise.then(() => {
          this.waitingForForm = false;
        })
      }
    })
  }

  get context(): DocumentRegistry.Context {
    return this._context;
  }

  get ready() {
    return this.componentReady.promise;
  }

  dispose(): void {
    if (this._monitor) {
      this._monitor.dispose();
    }
    this.componentRef.destroy();
    super.dispose();
  }

  protected onActivateRequest(msg: Message): void {
    this.node.tabIndex = -1;
    this.node.focus();
  }

  private _onPathChanged(): void {
    this.title.label = PathExt.basename(this._context.path);
  }
}

export
namespace FormWidget {
  export
  interface IOptions {
    context: DocumentRegistry.Context;
  }
}

export
class FormWidgetFactory extends ABCWidgetFactory<FormWidget, DocumentRegistry.IModel> {
  protected createNewWidget(context: DocumentRegistry.Context): FormWidget {
    return new FormWidget({ context });
  }
}