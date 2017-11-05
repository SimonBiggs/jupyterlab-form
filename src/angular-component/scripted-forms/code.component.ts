import {
  Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy
} from '@angular/core';

import { RenderMime, defaultRendererFactories } from '@jupyterlab/rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { Kernel } from '@jupyterlab/services';

import {
  Mode
} from '@jupyterlab/codemirror';

import { KernelService } from './kernel.service';
import { OutputService } from './output.service';

@Component({
  selector: 'code',
  template: `
<span #outputcontainer></span>
<span #codecontainer *ngIf="future === undefined"><ng-content></ng-content></span>`
})
export class CodeComponent implements OnInit, AfterViewInit, OnDestroy {

  name: string;
  renderMimeOptions: RenderMime.IOptions
  renderMime: RenderMime
  model: OutputAreaModel
  outputAreaOptions: OutputArea.IOptions
  outputArea: OutputArea

  promise: Promise<Kernel.IFuture>
  future: Kernel.IFuture

  code: string
  @ViewChild('codecontainer') codecontainer: ElementRef
  @ViewChild('outputcontainer') outputcontainer: ElementRef

  constructor(
    private myKernelSevice: KernelService,
    private myOutputService: OutputService,
    private _eRef: ElementRef
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.code = this.codecontainer.nativeElement.innerText
    Mode.ensure('python').then((spec) => {
      let el = document.createElement('div');
      Mode.run(this.code, spec.mime, el);
      this.codecontainer.nativeElement.innerHTML = el.innerHTML
      this._eRef.nativeElement.classList.add('cm-s-jupyter')
      this._eRef.nativeElement.classList.add('language-python')


    })
    this.model = new OutputAreaModel()
    this.renderMime = new RenderMime({ 
      initialFactories: defaultRendererFactories
    });

    this.outputAreaOptions = {
      model: this.model,
      rendermime: this.renderMime
    }

    this.outputArea = new OutputArea(this.outputAreaOptions)

    this.outputArea.model.changed.connect(() => {
      JSON.stringify(this.outputArea.model.toJSON())
      this.myOutputService.setOutput(this.name, this.outputArea.model)
    })
  }

  ngOnDestroy() {
    this.outputArea.dispose()
  }

  setName(name: string) {
    this.name = name;
  }

  runCode() {
    this.promise = this.myKernelSevice.runCode(this.code, this.name)
    this.promise.then(future => {
      if (future) {
        this.future = future
        this.outputArea.future = this.future
        this.outputcontainer.nativeElement.appendChild(this.outputArea.node)
      }
    })
  }


}
