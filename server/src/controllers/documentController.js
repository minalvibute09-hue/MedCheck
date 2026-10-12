import {
  extractMedicalDocument,
  isSupportedDocumentMimeType
} from '../services/documentExtraction.js';

const maxEncodedDocumentLength = 11 * 1024 * 1024;

export async function extract(req, res, next) {
  const { fileName, mimeType, data, text } = req.body || {};
  if (typeof fileName !== 'string' || !fileName.trim() || fileName.length > 255) {
    return res.status(400).json({ error: 'Choose a document with a valid file name.' });
  }
  if (typeof mimeType !== 'string' || !isSupportedDocumentMimeType(mimeType)) {
    return res.status(415).json({ error: 'Upload a PDF, photo, or plain-text document.' });
  }
  if (mimeType === 'text/plain') {
    if (typeof text !== 'string' || !text.trim() || text.length > 100000) {
      return res.status(400).json({ error: 'The text document is empty or too large to read.' });
    }
  } else if (
    typeof data !== 'string' ||
    data.length === 0 ||
    data.length > maxEncodedDocumentLength ||
    !/^[A-Za-z0-9+/]+={0,2}$/u.test(data)
  ) {
    return res.status(400).json({ error: 'The document is empty, invalid, or too large. Choose a file under 8 MB.' });
  }

  try {
    const record = await extractMedicalDocument({ fileName, mimeType, data, text });
    return res.json({ record });
  } catch (error) {
    return next(error);
  }
}
