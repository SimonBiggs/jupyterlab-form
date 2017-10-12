// Polyfills
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import {
  Widget
} from '@phosphor/widgets';

import {
  JSONExt
} from '@phosphor/coreutils';

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
  Component, NgModule, ApplicationRef, Type, Injector,
  ComponentFactoryResolver, ComponentRef, NgModuleRef, NgZone
} from '@angular/core';

import {
  BrowserModule
} from '@angular/platform-browser';

import { 
  platformBrowserDynamic 
} from '@angular/platform-browser-dynamic';

import {
  FormsComponent
} from './forms/forms.component';

// @Component({
//   selector: 'app-hello-world',
//   template: `<span>Hello world</span>`
// })
// export class HelloWorldComponent {};

@NgModule({
  imports: [BrowserModule],
  declarations: [FormsComponent],
  entryComponents: [FormsComponent]
})
export class AppModule {
  ngDoBootstrap(app: ApplicationRef) {}
};

export class AngularLoader {
  private applicationRef: ApplicationRef;
  private componentFactoryResolver: ComponentFactoryResolver;
  private ngZone: NgZone;
  private injector: Injector;

  constructor( ngModuleRef:NgModuleRef<AppModule> ) {
    this.injector = ngModuleRef.injector;
    this.applicationRef = this.injector.get(ApplicationRef);
    this.ngZone = this.injector.get(NgZone);
    this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
  }

  attachComponent<T>(component:Type<T>, dom:Element): ComponentRef<T> {
    let componentRef: ComponentRef<T>;
    this.ngZone.run(() => {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      componentRef = componentFactory.create(this.injector, [], dom);
      this.applicationRef.attachView(componentRef.hostView);

      console.log('angular bootstrap complete')
    });
    return componentRef;
  }
}

class FormWidget extends Widget {
  componentNode: HTMLElement
  angularLoader: AngularLoader;

  constructor() {
    super();
    this.id = 'form';
    this.title.label = 'form';
    this.title.closable = true;

    this.componentNode = document.createElement('app-hello-world');
    this.node.appendChild(this.componentNode);

    platformBrowserDynamic().bootstrapModule(AppModule)
    .then(ngModuleRef => {
      this.angularLoader = new AngularLoader(ngModuleRef);
      this.angularLoader.attachComponent(
        FormsComponent, this.componentNode)
    });
  }
}

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  let widget: FormWidget

  let tracker = new InstanceTracker<Widget>({
    namespace: 'form'
  });

  const command: string = 'form:open';
  
  app.commands.addCommand(command, {
    label: 'Open Form',
    execute: () => {
      if(!widget) {
        widget = new FormWidget();
      }
      if(!tracker.has(widget)) {
        tracker.add(widget);
      }
      if(!widget.isAttached) {
        app.shell.addToMainArea(widget);
      }
      app.shell.activateById(widget.id);
    }
  });

  palette.addItem({command, category: 'Form'})

  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'form'
  })

}

const extension: JupyterLabPlugin<void> = {
  id: 'form',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
