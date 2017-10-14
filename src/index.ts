// Polyfills
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import './theme.css';
import './style.css';
// import 'https://fonts.googleapis.com/icon?family=Material+Icons';

let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
link.setAttribute('async', '');
document.head.appendChild(link);

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

// import {
//   MimeDocumentFactory
//   // MimeDocument
// } from '@jupyterlab/docregistry';

import {
  ApplicationRef, Type, Injector,
  ComponentFactoryResolver, ComponentRef, NgZone,
  NgModuleRef
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

let selector = 'app-demo-form';

export class AngularLoader {
  private applicationRef: ApplicationRef;
  private componentFactoryResolver: ComponentFactoryResolver;
  private ngZone: NgZone;
  private injector: Injector;

  constructor( ngModuleRef: NgModuleRef<DemoFormModule>) {
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
    this.id = '@simonbiggs/scripted-form';
    this.title.label = 'Demo Form';
    this.title.closable = true;
    this.addClass('jp-scriptedFormWidget');

    this.componentNode = document.createElement(selector);
    this.node.appendChild(this.componentNode);

    platformBrowserDynamic().bootstrapModule(DemoFormModule)
    .then(ngModuleRef => {
      this.angularLoader = new AngularLoader(ngModuleRef);
      this.angularLoader.attachComponent(
        DemoFormComponent, this.componentNode)
    });
  }
}

// const FACTORY = 'Scripted Form';

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  // const primaryFileType = app.docRegistry.getFileType('markdown');
  // const factory = new MimeDocumentFactory({
  //   name: FACTORY,
  //   primaryFileType,
  //   fileTypes: ['markdown'],
  //   rendermime: app.rendermime
  // });
  let widget: FormWidget

  let tracker = new InstanceTracker<Widget>({
    namespace: 'form'
  });

  const demoCommand: string = 'form:demo';
  
  app.commands.addCommand(demoCommand, {
    label: 'Demo Form',
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
  
  // app.docRegistry.addWidgetFactory(factory);

  // // Handle state restoration.
  // restorer.restore(tracker, {
  //   command: 'docmanager:open',
  //   args: widget => ({ path: widget.context.path }),
  //   name: widget => widget.context.path
  // });

  // factory.widgetCreated.connect((sender, widget) => {
  //   // Notify the instance tracker if restore data needs to update.
  //   widget.context.pathChanged.connect(() => { tracker.save(widget); });
  //   tracker.add(widget);
  // });

  palette.addItem({command: demoCommand, category: 'Form'})

  restorer.restore(tracker, {
    command: demoCommand,
    args: () => JSONExt.emptyObject,
    name: () => 'Demo Form'
  })
}

const extension: JupyterLabPlugin<void> = {
  id: 'form',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
