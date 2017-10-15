import {
  Widget
} from '@phosphor/widgets';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  ApplicationRef, Type, Injector,
  ComponentFactoryResolver, ComponentRef, NgZone,
  NgModuleRef
} from '@angular/core';
  
import { 
  platformBrowserDynamic 
} from '@angular/platform-browser-dynamic';


export class AngularLoader {
  private applicationRef: ApplicationRef;
  private componentFactoryResolver: ComponentFactoryResolver;
  private ngZone: NgZone;
  private injector: Injector;

  constructor( ngModuleRef: NgModuleRef<{}>) {
    this.injector = ngModuleRef.injector;
    this.applicationRef = this.injector.get(ApplicationRef);
    this.ngZone = this.injector.get(NgZone);
    this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
  }

  attachComponent<T>(ngComponent:Type<T>, dom:Element): ComponentRef<T> {
    let componentRef: ComponentRef<T>;
    this.ngZone.run(() => {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ngComponent);
      componentRef = componentFactory.create(this.injector, [], dom);
      this.applicationRef.attachView(componentRef.hostView);
    });
    return componentRef;
  }
}

export class AngularWidget<C> extends Widget {
  angularLoader: AngularLoader;
  componentRef: ComponentRef<C>;
  componentReady = new PromiseDelegate<void>();

  constructor(ngModule: Type<{}>, ngComponent: Type<C>) {
    super();
    platformBrowserDynamic().bootstrapModule(ngModule)
    .then(ngModuleRef => {
      this.angularLoader = new AngularLoader(ngModuleRef);
      this.componentRef = this.angularLoader.attachComponent(
        ngComponent, this.node)
      this.componentReady.resolve(undefined);
    });
  }
}