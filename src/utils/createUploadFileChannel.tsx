import { buffers, eventChannel, END } from 'redux-saga';
import axios from 'axios';
import { urltoFile } from './utils';

export const createUploadFileChannel = (
  endpoint: string,
  headers: any,
  file: any,
  fileName: string,
  mimeType: string,
  formDataKey: string
) => {
  return eventChannel((emitter: any) => {
    const formData = new FormData();
    if (formDataKey === 'video' || formDataKey === 'job_video' || formDataKey === 'school_video') {
      formData.append(formDataKey, file);
      axios
        .patch(endpoint, formData, {
          headers,
          onUploadProgress: (e: ProgressEvent) => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100;
              emitter({ progress });
            }
          }
        })
        .then((res: any) => {
          emitter({ success: true, res });
          emitter(END);
        })
        .catch(err => {
          emitter({ err: new Error('Upload failed') });
          emitter(END);
        });
    } else {
      urltoFile(file, fileName, mimeType).then(file => {
        formData.append(formDataKey, file);
        axios
          .patch(endpoint, formData, {
            headers,
            onUploadProgress: (e: ProgressEvent) => {
              if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100;
                emitter({ progress });
              }
            }
          })
          .then((res: any) => {
            emitter({ success: true, res });
            emitter(END);
          })
          .catch(() => {
            emitter({ err: new Error('Upload failed') });
            emitter(END);
          });
      });
    }

    const unsubscribe = () => {};
    return unsubscribe;
  }, buffers.sliding(2));
};
