import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule, ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `<span>Hello world</span>`
})
export class HelloWorldComponent {};

@NgModule({
  declarations: [
    HelloWorldComponent
  ],
  imports: [
    BrowserModule
  ],
  entryComponents: [
    HelloWorldComponent
  ]
})
export class HelloWorldModule {
  ngDoBootstrap(app: ApplicationRef) {}
};