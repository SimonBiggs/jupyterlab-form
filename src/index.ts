// Polyfills
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import {
  JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  Widget
} from '@phosphor/widgets';

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


@Component({
  selector: 'app-hello-world',
  template: `<span>Hello world</span>`
})
export class HelloWorldComponent {};

let component = document.createElement('app-hello-world');

@NgModule({
  imports: [BrowserModule],
  declarations: [HelloWorldComponent],
  entryComponents: [HelloWorldComponent]
})
export class AppModule {
  ngDoBootstrap(app: ApplicationRef) {}
};


export class DynamicNg2Loader {
    private appRef: ApplicationRef;
    private componentFactoryResolver: ComponentFactoryResolver;
    private zone: NgZone;
    private injector: Injector;
    private ngModuleRef: NgModuleRef<AppModule> 

    constructor( ngModuleRef:NgModuleRef<AppModule> ) {
      this.ngModuleRef = ngModuleRef;
      this.injector = this.ngModuleRef.injector;
      this.appRef = this.injector.get(ApplicationRef);
      this.zone = this.injector.get(NgZone);
      this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
    }

    loadComponentAtDom<T>(component:Type<T>, dom:Element, onInit?: (Component:T) => void): ComponentRef<T> {
        let componentRef: ComponentRef<T>;
        this.zone.run(() => {
            try {
                let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
                componentRef = componentFactory.create(this.injector, [], dom);
                onInit && onInit(componentRef.instance);
                this.appRef.attachView(componentRef.hostView);
                
            } catch (e) {
                console.error("Unable to load component", component, "at", dom);
                throw e;
            }
        });
        return componentRef;
    }
}



/**
 * Initialization data for the jupyterlab_form extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'form',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app, palette: ICommandPalette) => {
    let angularLoader: DynamicNg2Loader;
    console.log(HelloWorldComponent)
    let widget: Widget = new Widget();
    widget.id = 'form';
    widget.title.label = 'form';
    widget.title.closable = true;

    widget.node.appendChild(component);
    platformBrowserDynamic().bootstrapModule(AppModule).then( ng2ModuleInjector => {
      angularLoader = new DynamicNg2Loader(ng2ModuleInjector);
      angularLoader.loadComponentAtDom(HelloWorldComponent, widget.node)
    });
    

    const command: string = 'form:open';
    app.commands.addCommand(command, {
      label: 'Form',
      execute: () => {
        if(!widget.isAttached) {
          app.shell.addToMainArea(widget);
        }
        app.shell.activateById(widget.id);
      }
    });
    palette.addItem({command, category: 'Open Form'})
  }
};

export default extension;
