/*
This service handles all communication to the Python Kernel.

It defines a queue with the aim to only ever send one request to the kernel
at a time and in a well defined order. This queue also handles dropping repeat
requests if the kernel is busy.
*/

import { Injectable } from '@angular/core';

import {
  Kernel, Session, ServerConnection, ServiceManager
} from '@jupyterlab/services';

import {
  PromiseDelegate
} from '@phosphor/coreutils';


@Injectable()
export class KernelService {
  services: ServiceManager;
  path: string;
  sessionConnected = new PromiseDelegate<void>();

  isNewSession: boolean;

  session: Session.ISession;
  kernel: Kernel.IKernelConnection;

  sessionStartCode = `
import json

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
%matplotlib inline

from IPython.display import display


def json_table_to_df(json_table):
    table = json.loads(json_table)
    columns = [t['name'] for t in table['schema']['fields']]
    index = table['schema']['primaryKey'][0]

    df = pd.DataFrame(
        table['data'],
        columns=columns)

    df.set_index(index, inplace=True)

    for column in columns:
        if column != index:
            df[column] = df[column].astype('float64')

    return df
`

  queueId = 0;
  queueLog: any = {};

  queue: Promise<any> = this.sessionConnected.promise;

  setServices(services: ServiceManager) {
    this.services = services;
  }

  setPath(path: string) {
    this.path = path;
  }

  pathChanged(path: string) {
    this.setPath(path);
    this.session.setPath(path);
  }

  sessionConnect() {
    const settings = ServerConnection.makeSettings({});

    const options = {
      kernelName: 'python3',
      serverSettings: settings,
      path: this.path
    };

    this.services.sessions.findByPath(this.path).then(model => {
      Session.connectTo(model.id, settings).then(session => {
        // console.log(session);
        this.sessionReady(session);
        this.isNewSession = false;
        this.sessionConnected.resolve(undefined);
        // console.log('previous session ready');
      });
    }).catch(() => {
      Session.startNew(options).then(session => {
        // console.log(session);
        this.sessionReady(session);
        this.isNewSession = true;
        this.sessionConnected.resolve(undefined);
        this.runCode(this.sessionStartCode, 'session_start_code')
        // console.log('new session ready');
      });
    });

  }

  sessionReady(session: Session.ISession) {
    this.session = session;
    this.kernel = this.session.kernel;
  }

  addToQueue(name: string, asyncFunction: (id: number ) => Promise<any>): Promise<any> {
    const currentQueueId = this.queueId;

    this.queueLog[currentQueueId] = name;
    this.queueId += 1;
    const previous = this.queue;
    return this.queue = (async () => {
      await previous;
      delete this.queueLog[currentQueueId];
      return asyncFunction(currentQueueId);
    })();
  }

  runCode(code: string, name: string): Promise<any> {
    let future: Kernel.IFuture;
    let runCode: boolean;

    const currentQueue = this.addToQueue(
      name, async (id: number): Promise<any> => {
        runCode = true;
        for (const key in this.queueLog ) {
          if (Number(key) > id && this.queueLog[key] === name) {
            runCode = false;
            break;
          }
        }
        if (runCode) {
          console.log('Run Code Queue Item');
          future = this.kernel.requestExecute({ code: code });
          return future;
        } else {
          return Promise.resolve();
        }
      }
    ).catch(err => {
      console.error(err);
    });
    this.addToQueue(null, async (id: number): Promise<any> => {
      if (runCode) {
        return await future.done;
      } else {
        return Promise.resolve();
      }

    });
    return currentQueue;
  }
}
