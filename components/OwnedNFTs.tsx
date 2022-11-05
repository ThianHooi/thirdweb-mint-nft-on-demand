import { ThirdwebNftMedia, useAddress, useContract } from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_TYPE } from '../lib/constant';
import { LinkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const OwnedNfts = () => {
  const { contract, isLoading: isLoadingContract } = useContract(
    CONTRACT_ADDRESS,
    CONTRACT_TYPE
  );
  const walletAddress = useAddress();
  const [ownedNftCount, setOwnedNftCount] = useState<number>(0);
  const [ownedNfts, setOwnedNfts] = useState<NFT[]>([]);
  const [render, setRender] = useState<boolean>(false);

  useEffect(() => {
    const getUserOwnedNftBalance = async () => {
      if (!walletAddress || !contract) return;

      const balance = await contract?.erc721.balanceOf(walletAddress);
      const nfts = await contract.getOwned(walletAddress);
      setOwnedNftCount(balance.toNumber());
      setOwnedNfts(nfts);
    };

    getUserOwnedNftBalance();
  }, [walletAddress, contract, render]);

  if (!walletAddress) {
    return null;
  }

  return (
    <div className="mt-4 border-t-primary-400 border-t-2 text-white py-8 flex justify-center items-center">
      <div className="w-3/4 px-4">
        <div className="flex justify-center items-center">
          <h1 className="text-xl text-center py-8">Your NFTs</h1>
          <ArrowPathIcon
            onClick={() => setRender(!render)}
            className="w-6 h-6 ml-4 cursor-pointer text-white"
          />
        </div>
        {ownedNftCount <= 0 && (
          <p className="text-center">You have not minted any NFTs</p>
        )}
        {ownedNftCount > 0 && (
          <div className="flex flex-wrap justify-around items-center space-x-8">
            {ownedNfts.map((nft, index) => {
              return (
                <div
                  key={index}
                  className="w-48 h-48 p-12 border-2 rounded-lg bg-transparent flex flex-col justify-center items-center"
                >
                  <ThirdwebNftMedia metadata={nft.metadata} />
                  <p className="mt-4">Token ID: {nft.metadata.id}</p>
                  <Link
                    href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${nft.metadata.id}`}
                    className="mt-4"
                  >
                    <LinkIcon className="w-4 h-4 text-white" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnedNfts;
