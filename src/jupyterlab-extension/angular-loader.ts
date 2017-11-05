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


export class AngularLoader<M> {
  private applicationRef: ApplicationRef;
  private componentFactoryResolver: ComponentFactoryResolver;
  ngZone: NgZone;
  private injector: Injector;

  constructor( ngModuleRef: NgModuleRef<M>) {
    this.injector = ngModuleRef.injector;
    this.applicationRef = this.injector.get(ApplicationRef);
    this.ngZone = this.injector.get(NgZone);
    this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
  }

  attachComponent<T>(ngComponent: Type<T>, dom: Element): ComponentRef<T> {
    let componentRef: ComponentRef<T>;
    this.ngZone.run(() => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ngComponent);
      componentRef = componentFactory.create(this.injector, [], dom);
      this.applicationRef.attachView(componentRef.hostView);
    });
    return componentRef;
  }
}

export class AngularWidget<C, M> extends Widget {
  angularLoader: AngularLoader<M>;
  ngZone: NgZone;
  componentRef: ComponentRef<C>;
  componentInstance: C;
  componentReady = new PromiseDelegate<void>();

  constructor(ngComponent: Type<C>, ngModule: Type<M>) {
    super();
    platformBrowserDynamic().bootstrapModule(ngModule)
    .then(ngModuleRef => {
      this.angularLoader = new AngularLoader(ngModuleRef);
      this.ngZone = this.angularLoader.ngZone;
      this.componentRef = this.angularLoader.attachComponent(
        ngComponent, this.node)
      this.componentInstance = this.componentRef.instance;
      this.componentReady.resolve(undefined);
    });
  }
}
