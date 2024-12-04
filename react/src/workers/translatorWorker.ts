import { pipeline } from '@huggingface/transformers';


class TranslationPipeline {
    static instance: Promise<any> | null = null;

    static async getInstance(progress_callback: Function = () => { }) {
        if (this.instance === null) {
            this.instance = pipeline('translation', 'Xenova/nllb-200-distilled-600M', { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const instance = await TranslationPipeline.getInstance((progress: { status: string; name: string; file: string; progress: any; }) => {
        const modelLoadingStatus = {
            file: progress.file,
            progress: (typeof progress.progress === 'number' ? parseFloat(progress.progress.toFixed(2)) : 0)
        };
        self.postMessage({ type: progress.status, data: modelLoadingStatus });
    });
    const result = await instance(event.data.text, {
        src_lang: 'eng_Latn',
        tgt_lang: 'yor_Latn',
        config: {
            max_length: 1000,
        }
    });
    self.postMessage({ type: 'completed', data: result[0].translation_text, index: event.data.index });
});

self.addEventListener('error', (error) => {
    console.error('Worker error:', error);
});
