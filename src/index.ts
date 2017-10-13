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
  ApplicationRef, Type, Injector,
  ComponentFactoryResolver, ComponentRef, NgZone
  // NgModuleRef
} from '@angular/core';

import { 
  platformBrowserDynamic 
} from '@angular/platform-browser-dynamic';

import {
  DemoFormComponent
} from './demo-form/demo-form.component';

import {
  DemoFormModule
} from './demo-form.module';

import {
  HelloWorldModule, HelloWorldComponent
} from './hello-world-module';

let components: any = {
  'app-demo-form': DemoFormComponent,
  'app-hello-world': HelloWorldComponent
};

let modules: any = {
  'app-demo-form': DemoFormModule,
  'app-hello-world': HelloWorldModule
};

let selector = 'app-demo-form';

// let module = modules[selector];
// let component = components[selector];


export class AngularLoader {
  private applicationRef: ApplicationRef;
  private componentFactoryResolver: ComponentFactoryResolver;
  private ngZone: NgZone;
  private injector: Injector;

  constructor( ngModuleRef: any) {
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

    this.componentNode = document.createElement(selector);
    this.node.appendChild(this.componentNode);

    platformBrowserDynamic().bootstrapModule(modules[selector])
    .then(ngModuleRef => {
      this.angularLoader = new AngularLoader(ngModuleRef);
      this.angularLoader.attachComponent(
        components[selector], this.componentNode)
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
