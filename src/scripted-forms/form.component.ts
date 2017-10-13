import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ViewContainerRef, ComponentRef,
  Compiler, ComponentFactory, NgModule,
  ModuleWithComponentFactories, ViewChildren, QueryList,
  // ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import * as  MarkdownIt from 'markdown-it';

import { Mode } from '@jupyterlab/codemirror';

import { ScriptedFormElementsModule } from './scripted-form-elements.module';
import { KernelService } from './kernel.service';
import { StartComponent } from './start.component';
import { VariableComponent } from './variable.component';
import { LiveComponent } from './live.component';
import { ButtonComponent } from './button.component';

interface IRuntimeComponent {
  initialiseForm: Function;
}

@Component({
  selector: 'app-form',
  template: `<div #container></div>`
})
export class FormComponent implements OnInit, AfterViewInit {

  myMarkdownIt: MarkdownIt.MarkdownIt;

  codeMirrorLoaded: Promise<any>;
  viewInitialised = false;

  formContents: string;

  // @ViewChild('errorbox') errorbox: ElementRef
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  private componentRef: ComponentRef<IRuntimeComponent>;

  constructor(
    // private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler,
    // private myKernelSevice: KernelService,
  ) { }

  ngOnInit() {
    this.codeMirrorLoaded = Mode.ensure('python').then(() => {
        return Mode.ensure('gfm');
      });

    this.myMarkdownIt = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });
  }

  ngAfterViewInit() {
    this.viewInitialised = true;
    if (this.formContents !== undefined) {
      this.buildForm(this.formContents);
    }
  }

  setFormContents(form: string) {
    if (this.viewInitialised) {
      this.buildForm(form);
    }

    this.formContents = form;
  }

  buildForm(form: string) {
    const customTags = form.replace(/\[start\]/g, '\n<form-start>\n'
    ).replace(/\[\/start\]/g, '\n</form-start>\n'
    ).replace(/\[live\]/g, '\n<form-live>\n'
    ).replace(/\[\/live\]/g, '\n</form-live>\n'
    ).replace(/\[button\]/g, '\n<form-button>\n'
    ).replace(/\[\/button\]/g, '\n</form-button>\n'
    ).replace(/\[number\]/g, '<form-variable type="number">'
    ).replace(/\[\/number\]/g, '</form-variable>'
    ).replace(/\[string\]/g, '<form-variable type="string">'
    ).replace(/\[\/string\]/g, '</form-variable>');

    const html = this.myMarkdownIt.render(customTags);
    const escapedHtml = html.replace(/{/g, '@~lb~@'
    ).replace(/}/g, '@~rb~@'
    ).replace(/@~lb~@/g, '{{ "{" }}'
    ).replace(/@~rb~@/g, '{{ "}" }}');

    this.compileTemplate(escapedHtml)
  }

  compileTemplate(template: string) {
    const metadata = {
      selector: `app-runtime`,
      template: template
    };

    const factory = this.createComponentFactory(
      this.compiler, metadata, null);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);

    // this.errorbox.nativeElement.innerHTML = ""
  }

  activateForm() {
    this.componentRef.instance.initialiseForm();
  }

  private createComponentFactory(compiler: Compiler, metadata: Component,
                                 componentClass: any): ComponentFactory<any> {
    @Component(metadata)
    class RuntimeComponent implements OnInit, OnDestroy, AfterViewInit {
      formActivation = false;

      @ViewChildren(StartComponent) startComponents: QueryList<StartComponent>
      @ViewChildren(VariableComponent) variableComponents: QueryList<VariableComponent>
      @ViewChildren(LiveComponent) liveComponents: QueryList<LiveComponent>
      @ViewChildren(ButtonComponent) buttonComponents: QueryList<ButtonComponent>


      constructor(
        private myKernelSevice: KernelService,
        // private myChangeDetectorRef: ChangeDetectorRef
      ) { }

      ngOnInit() {
        this.myKernelSevice.startKernel()
      }

      ngOnDestroy() {
        // this.myKernelSevice.forceShutdownKernel()
        if (this.formActivation) {
          this.myKernelSevice.shutdownKernel();
        }
      }

      ngAfterViewInit() {
        this.initialiseForm()
        // this.myChangeDetectorRef.detectChanges()
      }

      initialiseForm() {
        if (this.formActivation === false) {
          // this.myKernelSevice.startKernel();
          this.formActivation = true;

          // The order here forces all import components to run first.
          // Only then will the variable component fetch the variables.
          this.startComponents.toArray().forEach((startComponent, index) => {
            startComponent.setId(index);
            startComponent.runCode();
          });
          for (const variableComponent of this.variableComponents.toArray()) {
            variableComponent.fetchVariable();
          }
          this.myKernelSevice.queue.then(() => {
            this.liveComponents.toArray().forEach((liveComponent, index) => {
              liveComponent.setId(index);
              liveComponent.formReady();
            });

            for (const variableComponent of this.variableComponents.toArray()) {
              variableComponent.formReady();
            }

            this.buttonComponents.toArray().forEach((buttonComponent, index) => {
              buttonComponent.setId(index);
              buttonComponent.formReady();
            });
          });
        }

      }
    };

    @NgModule(
      {
        imports: [
          CommonModule,
          ScriptedFormElementsModule
        ],
        declarations: [
          RuntimeComponent
        ]
      }
    )
    class RuntimeComponentModule { }

    const module: ModuleWithComponentFactories<any> = (
      compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule));
    return module.componentFactories.find(
      f => f.componentType === RuntimeComponent);
  }

}
