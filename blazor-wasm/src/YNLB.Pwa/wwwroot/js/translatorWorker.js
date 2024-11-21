import { pipeline } from '@huggingface/transformers';

class TranslationPipeline {
    static task = 'translation';
    static model = 'Xenova/nllb-200-distilled-600M';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const { type, text } = event.data;
    if (type === 'init') {
        const instance = await TranslationPipeline.getInstance((progress) => {
            const modelLoadingStatus = {
                status: progress.status,
                name: progress.name,
                file: progress.file,
                progress: (progress.status === 'done' || progress.status === 'ready') ? 100 : parseInt(progress.progress || 0, 10)
            };
            self.postMessage({ type: 'progress', data: modelLoadingStatus });
        });
    }
    else if (type === 'translate') {
        const instance = await TranslationPipeline.getInstance();
        const result = await instance(text, {
            src_lang: 'eng_Latn',
            tgt_lang: 'yor_Latn',
            config: {
                max_length: 1000,

            }
        });
        console.log(result);
        self.postMessage({ type: 'completed', data: result[0].translation_text });
    }
});

self.addEventListener('error', (error) => {
    console.error('Worker error:', error);
});

// callback_function: (x) => {
//     const translatedText = instance.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true });
//     self.postMessage({ type: 'translating', data: translatedText });
// }
// {
//   "_from_model_config": true,
//   "bos_token_id": 0,
//   "decoder_start_token_id": 2,
//   "eos_token_id": 2,
//   "max_length": 200,
//   "pad_token_id": 1,
//   "transformers_version": "4.33.0.dev0"
// }
