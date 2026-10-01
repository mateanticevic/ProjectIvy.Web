import { fromEvent } from 'file-selector';
import { COMMON_MIME_TYPES } from 'file-selector/mime';
import { DropzoneOptions } from 'react-dropzone';

// Upload requests use file.type as Content-Type, so retain the full MIME fallback table.
export const getFilesFromEvent: NonNullable<DropzoneOptions['getFilesFromEvent']> = event =>
    fromEvent(event, { mimeTypes: COMMON_MIME_TYPES });
