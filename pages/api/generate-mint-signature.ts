import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CONTRACT_ADDRESS, CONTRACT_TYPE } from '../../lib/constant';
import { parseForm } from '../../lib/parse-form';
import { MintNftInput } from '../../types/MintPayload';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function generateMintSignature(
  nftMetadata: { name: string; image: Buffer | string },
  walletAddress: string
) {
  const PRIVATE_KEY = process.env.CONTRACT_DEPLOYER_PRIVATE_KEY;
  const mumbaiSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, 'mumbai');
  const nftContract = await mumbaiSDK.getContract(
    CONTRACT_ADDRESS,
    CONTRACT_TYPE
  );

  const payload = {
    metadata: nftMetadata,
    to: walletAddress,
  };

  const signedPayload = await nftContract.erc721.signature.generate(payload);
  return signedPayload;
}

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

      const createNftInput = fields as MintNftInput;

      const nftData = {
        name: createNftInput.name as string,
        image: readFileSync(url as string),
        id: 'id',
        uri: 'uri',
      };

      const signature = await generateMintSignature(
        nftData,
        createNftInput.walletAddress as string
      );

      res.status(200).json({ nftData, storedPath: url, signature });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
