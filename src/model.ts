import {
  DocumentModel, DocumentRegistry
} from '@jupyterlab/docregistry';

import {
 IModelDB
} from '@jupyterlab/coreutils';

import {
  Contents
} from '@jupyterlab/services';




export
namespace FormResultsModel {
  /**
   * An options object for initializing a notebook model.
   */
  export
  interface IOptions {
    /**
     * The language preference for the model.
     */
    languagePreference?: string;

    /**
     * A modelDB for storing notebook data.
     */
    modelDB?: IModelDB;
  }
}

export
class FormResultsModel extends DocumentModel {

  constructor(options: FormResultsModel.IOptions = {}) {
    super(options.languagePreference, options.modelDB);
  }

  /**
   * Dispose of the resources held by the model.
   */
  dispose(): void {
    // do something

    // then
    super.dispose();
  }

  /**
   * Serialize the model to a string.
   */
  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Deserialize the model from a string.
   */
  fromString(value: string): void {
    this.fromJSON(JSON.parse(value));
  }

  /**
   * Serialize the model to JSON.
   */
  toJSON() {

    return {};
  }

  /**
   * Deserialize the model from JSON.
   */
  fromJSON(value: any): void {
  
  }
}



export
namespace FormResultsModelFactory {
  export
  interface IOptions {

  }
}

export
class FormResultsModelFactory implements DocumentRegistry.IModelFactory<DocumentRegistry.IModel> {
  private _disposed = false;

  constructor(options: FormResultsModelFactory.IOptions) { }

  /**
   * The name of the model.
   */
  get name(): string {
    return 'form-results';
  }

  /**
   * The content type of the file.
   */
  get contentType(): Contents.ContentType {
    return 'file';
  }

  /**
   * The format of the file.
   */
  get fileFormat(): Contents.FileFormat {
    return 'text';
  }

  /**
   * Get whether the model factory has been disposed.
   */
  get isDisposed(): boolean {
    return this._disposed;
  }

  /**
   * Dispose of the model factory.
   */
  dispose(): void {
    this._disposed = true;
  }

  /**
   * Create a new model for a given path.
   *
   * @param languagePreference - An optional kernel language preference.
   *
   * @returns A new document model.
   */
  createNew(languagePreference?: string, modelDB?: IModelDB): DocumentRegistry.IModel {
    return new FormResultsModel({ languagePreference, modelDB });
  }

  /**
   * Get the preferred kernel language given a path.
   */
  preferredLanguage(path: string): string {
    return '';
  }
}
