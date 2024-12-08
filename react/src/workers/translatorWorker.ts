import { pipeline } from '@huggingface/transformers';

// Helper function to split text into sentences
function splitIntoSentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+/g) || [text];
}

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

    const sentences = splitIntoSentences(event.data.text);
    const translations: string[] = [];

    for (let i = 0; i < sentences.length; i++) {
        const result = await instance(sentences[i].trim(), {
            src_lang: 'eng_Latn',
            tgt_lang: 'yor_Latn',
            config: {
                max_length: 1000,
            }
        });

        translations.push(result[0].translation_text);

        if (i < sentences.length - 1) {
            self.postMessage({
                type: 'update',
                data: result[0].translation_text,
                index: event.data.index,
                progress: ((i + 1) / sentences.length) * 100
            });
        }
    }

    // Send final completion message with all translations
    self.postMessage({
        type: 'completed',
        data: translations.join(' '),
        index: event.data.index
    });
});

self.addEventListener('error', (error) => {
    console.error('Worker error:', error);
});
