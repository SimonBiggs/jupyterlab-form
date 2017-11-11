/**
 * Since the template for the form changes within the user interface
 * the form component needs to be re-compiled each time the template changes.
 * 
 * This file exports a the `createFormComponentFactory` function which
 * creates a new form component factory based on the provided template.
 * 
 * Within that function is the `FormComponent`. This component takes in the
 * provided template and then initialises the form.
 * 
 * Form initialisation logic and ordering is all defined within the `initialiseForm`
 * function within the `FormComponent`.
 */


import {
  Component, ViewChildren, QueryList,
  Compiler, ComponentFactory, NgModule,
  ModuleWithComponentFactories
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { KernelService } from '../services/kernel.service';

import { SectionsModule } from '../sections-module/sections.module';
import { StartComponent } from '../sections-module/start.component';
import { LiveComponent } from '../sections-module/live.component';
import { ButtonComponent } from '../sections-module/button.component';

import { VariablesModule } from '../variables-module/variables.module';
import { NumberComponent } from '../variables-module/number.component';
import { StringComponent } from '../variables-module/string.component';
import { TableComponent } from '../variables-module/table.component';

import { CodeModule } from '../code-module/code.module';


/**
 * Create a form component factory given an Angular template in the form of metadata.
 * 
 * @param compiler the Angular compiler
 * @param metadata the template containing metadata
 * 
 * @returns a factory which creates form components
 */
export
function createFormComponentFactory(compiler: Compiler, metadata: Component): ComponentFactory<any> {
  /**
   * The form component that is built each time the template changes
   */
  @Component(metadata)
  class FormComponent {   
    @ViewChildren(StartComponent) startComponents: QueryList<StartComponent>;
    @ViewChildren(LiveComponent) liveComponents: QueryList<LiveComponent>;
    @ViewChildren(ButtonComponent) buttonComponents: QueryList<ButtonComponent>;

    @ViewChildren(NumberComponent) numberComponents: QueryList<NumberComponent>;
    @ViewChildren(StringComponent) stringComponents: QueryList<StringComponent>;
    @ViewChildren(TableComponent) tableComponents: QueryList<TableComponent>;
  
    constructor(
      private myKernelSevice: KernelService
    ) { }
  
    ngAfterViewInit() {
      this.initialiseForm();
    }
  
    /**
     * Initialise the form. Code ordering during initialisation is defined here.
     */
    private initialiseForm() {
      // Only begin initialisation once the kernel is connected
      this.myKernelSevice.sessionConnected.promise.then(() => {

        // console.log('session connected');
        // console.log(this.startComponents);

        // The start component section is run first
        this.startComponents.toArray().forEach((startComponent, index) => {
          startComponent.setId(index);

          // Only run the code of a start component if it is a new session.
          // Once the data model for the form results has been built it can
          // be used to facilitate determining whether or not the code within
          // start component(s) have changed. If it has changed the code should
          // be re-run even if it isn't a new session.
          if (this.myKernelSevice.isNewSession) {
            startComponent.runCode();
          }
        });
        this.myKernelSevice.isNewSession = false;

        // Variable components are initialised second
        for (const numberComponent of this.numberComponents.toArray()) {
          numberComponent.pullVariable();
        }
        for (const stringComponent of this.stringComponents.toArray()) {
          stringComponent.pullVariable();
        }
        for (const tableComponent of this.tableComponents.toArray()) {
          tableComponent.pullVariable();
        }

        // Wait until the code queue is complete before declaring form ready to
        // the various components.
        this.myKernelSevice.queue.then(() => {
          // Tell the live components that the form is ready
          this.liveComponents.toArray().forEach((liveComponent, index) => {
            liveComponent.setId(index);
            liveComponent.formReady();
          });

          // Tell the variable components that the form is ready
          for (const numberComponent of this.numberComponents.toArray()) {
            numberComponent.formReady();
          }
          for (const stringComponent of this.stringComponents.toArray()) {
            stringComponent.formReady();
          }
          for (const tableComponent of this.tableComponents.toArray()) {
            tableComponent.formReady();
          }

          // Tell the button components that the form is ready
          this.buttonComponents.toArray().forEach((buttonComponent, index) => {
            buttonComponent.setId(index);
            buttonComponent.formReady();
          });
        });
      });
    }
  }

  // The Angular module for the form component
  @NgModule(
    {
      imports: [
        CommonModule,
        SectionsModule,
        VariablesModule,
        CodeModule
      ],  
      declarations: [
        FormComponent
      ]
    }
  )
  class FormComponentModule { }

  // Compile the template
  const module: ModuleWithComponentFactories<FormComponentModule> = (
    compiler.compileModuleAndAllComponentsSync(FormComponentModule));

  // Return the factory
  return module.componentFactories.find(
    f => f.componentType === FormComponent);
}