class TranslatorService {
    constructor() {
        console.log('Loading worker script');
        this.worker = new Worker(new URL('../dist/bundle.worker.js', import.meta.url), { type: 'module' });
        this.worker.onmessage = (event) => {
            const { type, data } = event.data;
            if (type === 'progress') {
                this.dotnetObjectRef.invokeMethod('OnProgress', data);
            } else if (type === 'translating') {
                this.dotnetObjectRef.invokeMethod('OnTranslating', data);
            } else if (type === 'completed') {
                this.dotnetObjectRef.invokeMethod('OnTranslationCompleted', data);
                this.saveTranslationHistory(data.originalText, data.translatedText);
            }
        };
        this.worker.onerror = (error) => {
            console.error('Service error:', error);
        };
    }

    init(dotnetObjectRef) {
        console.log('Model loading started');
        this.dotnetObjectRef = dotnetObjectRef;
        console.log('Posting init message to worker');
        this.worker.postMessage({ type: 'init' });
    }

    translate(text) {
        this.worker.postMessage({ type: 'translate', text });
    }

    cancelLoading() {
        this.worker.terminate();
        console.log('Model loading cancelled');
    }

    saveTranslationHistory(text, translatedText) {
        const history = JSON.parse(localStorage.getItem('translationHistory')) || [];
        history.push({ text, translatedText, date: new Date().toISOString() });
        localStorage.setItem('translationHistory', JSON.stringify(history));
    }

    getTranslationHistory() {
        return JSON.parse(localStorage.getItem('translationHistory')) || [];
    }
}

const translatorService = new TranslatorService();
window.translatorService = translatorService;

