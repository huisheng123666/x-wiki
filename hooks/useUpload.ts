import {useCallback, useState} from "react";
import {post} from "@/util/http";

interface UploadParams {
  multiple?: boolean;
  validateFile?: (file: File) => string;
}

export function useUpload({ multiple = false, validateFile }: UploadParams) {
  const [urls, setUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const upload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    let isCancel = true;
    return new Promise<string>((resolve, reject) => {
      input.addEventListener('change', () => {
        isCancel = false;
        const file = input.files ? input.files[0] : null;
        if (!file) {
          reject('未选择文件');
          return;
        }
        let msg = validateFile && validateFile(file)
        if (msg) {
          reject(msg);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true)
        post<{ data: string }>({ url: '/utils/upload', data: formData })
          .then(data => {
            setUrls([
              ...urls,
              data.data
            ])
            setLoading(false)
            resolve(data.data)
          })
          .catch((err) => {
            setLoading(false)
            reject(err.message)
          })
      });
      window.addEventListener(
        'focus',
        () => {
          setTimeout(() => {
            if (isCancel) {
              reject('未选择文件');
            }
          }, 300);
        },
        { once: true }
      );
    });
  }, [urls, validateFile])

  return {
    urls,
    upload,
    loading
  }
}
