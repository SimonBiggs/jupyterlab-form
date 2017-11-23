/*
The Form Component has a function `setFormContents` which is callable on this
component with a string input. Once this function is called the form rebuilds
with the provided contents.
*/

import {
  Component, OnInit, AfterViewInit,
  ViewChild, ViewContainerRef, ComponentRef,
  Compiler, ElementRef
} from '@angular/core';


import * as  MarkdownIt from 'markdown-it';

import { createFormComponentFactory } from './create-form-component-factory';

import { JupyterlabModelService } from '../services/jupyterlab-model.service';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

@Component({
  selector: 'app-form-builder',
  template: `<div #errorbox class="errorbox"></div><div #container></div>`
})
export class FormBuilderComponent implements OnInit, AfterViewInit {
  myMarkdownIt: MarkdownIt.MarkdownIt;
  viewInitialised = new PromiseDelegate<void>();

  @ViewChild('errorbox') errorbox: ElementRef;
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  errorboxDiv: HTMLDivElement;

  private formComponentRef: ComponentRef<any>;

  constructor(
    private compiler: Compiler,
    private myJupyterlabModelService: JupyterlabModelService
  ) { }

  ngOnInit() {
    this.myMarkdownIt = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });
  }

  ngAfterViewInit() {
    this.errorboxDiv = this.errorbox.nativeElement;
    this.viewInitialised.resolve(undefined);
  }

  /**
   * Set or update the template of the form.
   * 
   * This function makes sure to only begin building the form once the component
   * has sufficiently initialised.
   */
  public buildForm() {
    const markdownTemplate = this.myJupyterlabModelService.getTemplate()
    this.viewInitialised.promise.then(() => {
      const htmlTemplate = this.convertTemplate(markdownTemplate);

      // Create the form component
      this.createFormFromTemplate(htmlTemplate);
    });
  }

  /**
   * Convert the form template from markdown to its final html state.
   * 
   * @param markdownTemplate The markdown template.
   * 
   * @returns The html template.
   */
  private convertTemplate(markdownTemplate: string): string {
    // Replace the form syntax with their respective angular component tags
    const customTags = markdownTemplate.replace(/\[start\]/g, '\n<app-start>\n'
    ).replace(/\[\/start\]/g, '\n</app-start>\n'
    ).replace(/\[live\]/g, '\n<app-live>\n'
    ).replace(/\[\/live\]/g, '\n</app-live>\n'
    ).replace(/\[button\]/g, '\n<app-button>\n'
    ).replace(/\[\/button\]/g, '\n</app-button>\n'
    ).replace(/\[number\]/g, '<app-number>'
    ).replace(/\[\/number\]/g, '</app-number>'
    ).replace(/\[string\]/g, '<app-string>'
    ).replace(/\[\/string\]/g, '</app-string>'
    ).replace(/\[table\]/g, '<app-table>'
    ).replace(/\[\/table\]/g, '</app-table>'
    ).replace(/\[tick\]/g, '<app-tick>'
    ).replace(/\[\/tick\]/g, '</app-tick>'
    ).replace(/\[toggle\]/g, '<app-toggle>'
    ).replace(/\[\/toggle\]/g, '</app-toggle>'
    ).replace(/\[slider\]/g, '<app-slider>'
    ).replace(/\[\/slider\]/g, '</app-slider>');

    // Render the markdown to html
    const html = this.myMarkdownIt.render(customTags);

    // Escape '{}' characters as these are special characters within Angular
    const escapedHtml = html.replace(/{/g, '@~lb~@'
    ).replace(/}/g, '@~rb~@'
    ).replace(/@~lb~@/g, '{{ "{" }}'
    ).replace(/@~rb~@/g, '{{ "}" }}');

    const htmlTemplate = escapedHtml
    return htmlTemplate
  }

  /**
   * Create the form component from the html template with the Angular compiler.
   * 
   * @param template The html Angular component template
   */
  private createFormFromTemplate(template: string) {
    const metadata = {
      selector: `app-form`,
      template: template
    };

    // Create the form component factory
    const formFactory = createFormComponentFactory(this.compiler, metadata);

    // If a form already exists remove it before continuing
    if (this.formComponentRef) {
      this.formComponentRef.destroy();
    }

    // If a previous compile produced an error, clear the error message
    this.errorboxDiv.innerHTML = '';

    // Create the form component
    this.formComponentRef = this.container.createComponent(formFactory);
  }
}
