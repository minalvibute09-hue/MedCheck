import multer from 'multer';
import { saveMedicalRecord } from '../models/MedicalRecord.js';
import {
  extractMedicalDocument,
  isSupportedDocumentMimeType
} from '../services/documentExtraction.js';

const maxFileSize = 10 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize, files: 1, fields: 1, fieldSize: 20 },
  fileFilter(_req, file, callback) {
    if (!isSupportedDocumentMimeType(file.mimetype)) {
      const error = new Error('Upload a JPG, PNG, WebP image, or PDF.');
      error.status = 415;
      callback(error);
      return;
    }
    callback(null, true);
  }
});

export function receiveDocument(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      error.status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      error.message = error.code === 'LIMIT_FILE_SIZE'
        ? 'The file is too large. Choose a file up to 10 MB.'
        : 'Upload one document file and choose one language.';
    }
    return next(error);
  });
}

function safeFileName(fileName) {
  return fileName.replace(/[\\/\0]/gu, '_').slice(0, 180) || 'Medical document';
}

export async function extract(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'Choose a photo or PDF to scan.' });
  }

  const language = req.body.language || 'en-IN';
  try {
    const result = await extractMedicalDocument({
      data: req.file.buffer,
      mimeType: req.file.mimetype,
      fileName: safeFileName(req.file.originalname),
      patientId: req.user.id,
      language
    });
    if (!result.readable) {
      return res.json({
        readable: false,
        message: 'The photo is hard to read. Please retake it in good light with the paper flat.'
      });
    }

    await saveMedicalRecord(req.user.id, result.record);
    return res.status(201).json(result);
  } catch (error) {
    if (!Number.isInteger(error.status) || error.status >= 500) error.status = 502;
    return next(error);
  }
}
