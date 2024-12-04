export class WorkerContainer {
    private worker: Worker;
    private messageHandlers: { [key: string]: (data: any, worker: WorkerContainer) => void } = {};

    constructor() {
        this.worker = new Worker(new URL('../workers/translatorWorker.ts', import.meta.url), { type: 'module' });
        this.worker.onmessage = this.handleMessage.bind(this);
    }

    private handleMessage(event: MessageEvent) {
        const { type, data, index } = event.data;
        if (this.messageHandlers[type]) {
            this.messageHandlers[type]({ data, index }, this);
        }
    }

    public registerMessageHandler(type: string, handler: (data: any, worker: WorkerContainer) => void) {
        this.messageHandlers[type] = handler;
    }

    public sendMessage(message: any) {
        this.worker.postMessage(message);
    }

    public terminate() {
        this.worker.removeEventListener('message', this.handleMessage);
        this.worker.terminate();
    }
}