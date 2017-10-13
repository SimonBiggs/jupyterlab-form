import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule, ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `<span>Hello world! Test = {{test}}</span>`
})
export class HelloWorldComponent {
  test = 4;
};

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