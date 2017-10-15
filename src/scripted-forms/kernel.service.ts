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
  sessionConnected = new PromiseDelegate<boolean>();

  session: Session.ISession;
  kernel: Kernel.IKernelConnection;

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
  }

  sessionConnect() {
    let settings = ServerConnection.makeSettings({});
    
    let options = {
      kernelName: 'python3',
      serverSettings: settings,
      path: this.path
    };

    this.services.sessions.findByPath(this.path).then(model => {
      // console.log(model);
      Session.connectTo(model.id, settings).then(session => {
        console.log(session);
        this.sessionReady(session);
        this.sessionConnected.resolve(false);
        console.log('previous session ready')
      })
    }).catch(() => {
      Session.startNew(options).then(session => {
        console.log(session);
        this.sessionReady(session);
        this.sessionConnected.resolve(true);
        console.log('new session ready')
      })
    })
    
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
      // console.log(previous);
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
