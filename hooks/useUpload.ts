import {useCallback, useState} from "react";
import {post} from "@/util/http";

interface UploadParams {
  multiple?: boolean;
  validateFile?: (file: File) => boolean;
}

export function useUpload({ multiple = false, validateFile }: UploadParams) {
  const [urls, setUrls] = useState<string[]>([])

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
        if (validateFile && !validateFile(file)) {
          reject('文件校验未通过');
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        post<{ data: string }>({ url: '/utils/upload', data: formData })
          .then(data => {
            setUrls([
              ...urls,
              data.data
            ])
            resolve(data.data)
          })
          .catch((err) => {
            reject(err)
          })
      });
      window.addEventListener(
        'focus',
        () => {
          setTimeout(() => {
            if (isCancel) {
              reject('未选择文件');
            }
          }, 100);
        },
        { once: true }
      );
    });
  }, [urls, validateFile])

  return {
    urls,
    upload
  }
}
