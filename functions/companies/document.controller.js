const path = require('path');
const fs = require('fs');
const os = require('os');
const express = require('express');
const Busboy = require('busboy');
const {v4: uuidv4} = require('uuid');
const {getFirebaseAdmin} = require('../index.admin');

const admin = getFirebaseAdmin();

const bucket = admin.storage().bucket();

/**
 * Document Controller
 */
class DocumentController {
  // Handles file upload from a multipart request, stores it in Firebase Storage, and records metadata in Firestore
  /**
   * @param {any} req
   * @param {Response} res
   */
  static async create(req, res) {
    const FIELD_NAMES = {
      DOCUMENT: 'document',
      CATEGORY_ID: 'category_id',
      COMPANY_ID: 'company_id'
    };

    try {
      // eslint-disable-next-line
      const {store, body, user, file, cycle} = req;

      const busboy = new Busboy({headers: req.headers});
      // This object will accumulate all the uploaded files, keyed by their name
      const uploads = {};
      const others = {};

      // This callback will be invoked for each file uploaded
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const friendlyFileName = uuidv4() + path.extname(filename);

        // Note that os.tmpdir() is an in-memory file system, so should only
        // be used for files small enough to fit in memory.
        const filepath = path.join(os.tmpdir(), friendlyFileName);

        uploads[fieldname] = {
          file: filepath,
          originalFileName: filename
        };
        file.pipe(fs.createWriteStream(filepath));
      });

      busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
        others[fieldname] = val;
      });

      // This callback will be invoked after all uploaded files are saved.
      busboy.on('finish', async () => {
        // uploads[fieldName].file === path to uploaded file
        const {file: localFilePath, originalFileName} = uploads[FIELD_NAMES.DOCUMENT];
        const categoryId = others[FIELD_NAMES.CATEGORY_ID];
        try {
          const [file, metadata] = await bucket.upload(localFilePath);
          store.documents.create(user, {
            originalFileName,
            fileName: file.name,
            storageId: metadata.id,
            contentType: metadata.contentType,
            size: metadata.size,
            category_id: others[FIELD_NAMES.CATEGORY_ID],
            owner: {id: categoryId},
            cycle_id:"vJqDawZlrKNHsMIW9G2s",
            companyId:others[FIELD_NAMES.COMPANY_ID],
          });
          res.write(`Cloud file data: ${JSON.stringify(metadata)}\n`);
          res.end();
        } catch (e) {
          console.error('Upload failed: ', e);
          res.status(500).json({
            message: e.toString()
          });
        }
      });

      // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
      // a callback when it's finished.
      busboy.end(req.rawBody);
    } catch (e) {
      console.error(e);
      res.sendStatus(500).end();
    }
  }

  // Retrieves all documents for a specific category, optionally filtered by company and cycle
  /**
   * @param {any} req
   * @param {Response} res
   */
  static async forCategory(req, res) {
    const {
      user,
      store,
      params: {id: categoryId},
      query: {company_id: companyId, cycle_id: cycleId}
    } = req;
    const result = await store.documents.getDocumentsForCategory(companyId || user.company_user.company_id, categoryId, cycleId);
    res.json({
      baseUrl: `https://www.googleapis.com/storage/v1/b/${process.env.PROJECT_ID}.appspot.com/o/`,
      result,
    });
  }

  // Deletes a document from Firebase Storage and removes its metadata from Firestore if the user is authorized
  /**
   * @param {any} req
   * @param {Response} res
   */
  static async delete(req, res) {
    const {store, params, user} = req;
    const doc = await store.documents.getById(user, params.id);

    if (!doc) return res.status(404).json({message: 'Resource not found.'});
    if (doc.user_id !== user.id) return res.status(403).json({message: 'Unauthorized'});

    await bucket.file(doc.file_name).delete();
    await store.documents.removeDocument(user, params.id);
    res.json({result: 'ok'});
  }
}

const documentRouter = new express.Router();
documentRouter.post('/', DocumentController.create);
documentRouter.get('/list/category/:id', DocumentController.forCategory);
documentRouter.delete('/:id', DocumentController.delete);

module.exports.documentRouter = documentRouter;
