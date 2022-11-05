import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { CONTRACT_ADDRESS, CONTRACT_TYPE } from '../../lib/constant';
import { MintNftInput } from '../../types/MintPayload';

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
  const uploadDir = join(
    process.env.ROOT_DIR || process.cwd(),
    `/public/images`
  );
  const { method, body } = req;

  switch (method) {
    case 'POST':
      const createNftInput = JSON.parse(body) as MintNftInput;

      const nftData = {
        name: createNftInput.name as string,
        image: createNftInput.image,
      };

      const signature = await generateMintSignature(
        nftData,
        createNftInput.walletAddress as string
      );

      res.status(200).json({
        nftData,
        storedPath: join(uploadDir, createNftInput.image),
        signature,
      });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
