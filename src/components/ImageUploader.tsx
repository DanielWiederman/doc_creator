import { useEffect, useState } from "react";

export const useImageProccesor = (image: File | null) => {
    const [uploadedImage, setUploadedImage] = useState<string | File | null>(null);
    const [processedImage, setProcessedImage] = useState<string |File | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const preprocessImage = (dataURL: string) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);
            // Apply preprocessing techniques here
            grayscale(ctx);
            threshold(ctx);
            // Convert processed image back to data URL
            const processedDataURL = canvas.toDataURL();
            setProcessedImage(processedDataURL);
        };
        img.src = dataURL;
    };

    // Grayscale conversion
    const grayscale = (ctx: CanvasRenderingContext2D) => {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = brightness;
            data[i + 1] = brightness;
            data[i + 2] = brightness;
        }
        ctx.putImageData(imageData, 0, 0);
    };

    // Thresholding
    const threshold = (ctx: CanvasRenderingContext2D) => {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        const thresholdValue = 100; // Example threshold value
        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const newValue = brightness > thresholdValue ? 255 : 0;
            data[i] = newValue;
            data[i + 1] = newValue;
            data[i + 2] = newValue;
        }
        ctx.putImageData(imageData, 0, 0);
    };

    useEffect(() => {
        const file = image;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const dataURL = reader.result as string;
                setUploadedImage(dataURL);
                preprocessImage(dataURL);
            };
            reader.readAsDataURL(file);
        }
    }, [image, preprocessImage])

    return {processedImage, uploadedImage}
};