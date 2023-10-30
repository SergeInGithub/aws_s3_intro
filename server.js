import express from 'express';
import multer from 'multer';
import { uploadFile, getFileStream } from './s3.js';
import fs from 'fs';
import util from 'util';

const upload = multer({ dest: 'uploads/' });
const unlinkFile = util.promisify(fs.unlink);

const app = express();

app.get('/images/:key', (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file;
  const info = req.body.description;
  console.log(file);
  //   console.log(info);

  const result = await uploadFile(file);
  await unlinkFile(file.path);

  console.log(result);
  res.send({ imagePath: `/images/${result.Key}` });
});

app.listen(8080, () => console.log('listening on port 8080'));
