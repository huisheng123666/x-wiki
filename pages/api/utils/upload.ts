import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, {File} from 'formidable'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<string>>
) {
  try {
    const path = await writeFile(req)
    res.status(200).json({ code: 1, data: path })
  } catch (err) {
    res.status(200).json({ code: 0, message: '上传失败' })
  }
}

function writeFile(req: NextApiRequest) {
  const form = formidable({
    keepExtensions: true,
    uploadDir: './upimgs'
    // fileWriteStreamHandler: (file: any) => {
    //   const pass = new PassThrough();
    //   const target = path.join('./public/imgs', '123.png');
    //   const writeStream = fs.createWriteStream(target);
    //   pass.pipe(writeStream)
    //   pass.on('close', () => {
    //     writeStream.end()
    //   })
    //   return writeStream
    // }
  });
  return new Promise<string>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      } else {
        resolve('/api/img/' + (files.file as File).newFilename)
      }
    })
  })
}


export const config = {
  api: {
    bodyParser: false,
  },
}
