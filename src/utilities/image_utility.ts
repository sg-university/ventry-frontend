import Resizer from "react-image-file-resizer";

class ImageUtility {
    resizeFile = (file: File, maxWidth: number = 298, maxHeight: number = 160, format: string = 'JPEG') => new Promise<string>(resolve => {
        Resizer.imageFileResizer(file, maxWidth, maxHeight, format, 100, 0,
            (uri: any) => {
                resolve(uri.replace(/^.*,/, ''));
            }, 'base64');
    });

    blobToBase64AsURL = (blob: Blob) => new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        }
    );

    blobToBase64AsData = (blob: Blob) => {
        return `data:image/jpeg;base64,${blob}`
    }
}

export default ImageUtility;