import type { NextApiRequest, NextApiResponse } from 'next';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { parseForm } from '../../lib/parse-form';
import { readFileSync } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const { fields, files } = await parseForm(req);
      const file = files.file;
      let url = Array.isArray(file)
        ? file.map((f) => f.filepath)
        : file.filepath;

      const storage = new ThirdwebStorage();
      const nftData = {
        name: fields.name,
        image: readFileSync(url as string),
      };

      const uri = await storage.upload(nftData);
      const ipfsUrl = await storage.resolveScheme(uri);

      res.status(200).json({ uri, ipfsUrl, nftData, storedPath: url });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
