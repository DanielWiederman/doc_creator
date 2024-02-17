import { useEffect, useState } from 'react'
import { PSM, Worker, createWorker } from 'tesseract.js';

const MIN_CONFIDENCE = 50
const MIN_WORD_LENGTH = 1

export const useTesseract = (
    imgProp: Blob | File | HTMLImageElement | HTMLCanvasElement | null,
    lang: string[]
) => {
    const [words, setWords] = useState<Tesseract.Word[]>([])
    const [loadingText, setLoadingText] = useState<boolean>(false)
    const langs = lang.join("+")
    
    useEffect(() => {
        let worker: Worker

        if (!imgProp) {
            return
        }

        (async () => {
            try {
                setLoadingText(true);
                worker = await createWorker(langs);
                worker.setParameters({tessedit_pageseg_mode: PSM.SINGLE_BLOCK, tessedit_char_blacklist: "={}))<>"})
                const ret = await worker.recognize(imgProp);
                setWords(ret.data.words.filter(word => word.text?.length > MIN_WORD_LENGTH && word.confidence > MIN_CONFIDENCE ))
                await worker.terminate();
                setLoadingText(false);
            } catch (error) {
                console.log(error)
                setLoadingText(false);
            }
        })();

        return () => {
            worker?.terminate();
        };
    }, [imgProp, langs])

    return { words, loadingText }
}
