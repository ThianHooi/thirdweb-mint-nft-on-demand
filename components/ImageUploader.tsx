import {
  useAddress,
  useChainId,
  useContract,
  useNetwork,
  useNetworkMismatch,
} from '@thirdweb-dev/react';
import {
  ChainId,
  SignedPayload721WithQuantitySignature,
} from '@thirdweb-dev/sdk';
import { useState } from 'react';
import { CONTRACT_ADDRESS } from '../lib/constant';
import handleFetchErrors from '../util/handle-fetch-error';
import classNames from 'classnames';
import Spinner from './Spinner';
import { NftChoices } from '../lib/NftChoices';
import Image from 'next/image';

const ImageUploader = () => {
  const [image, setImage] = useState<Blob>();
  const [createObjectURL, setCreateObjectURL] = useState<string>();
  const [inputNftName, setInputNftName] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>();

  const { contract, isLoading: isLoadingContract } = useContract(
    CONTRACT_ADDRESS,
    'nft-collection'
  );
  const walletAddress = useAddress();
  const isMismatched = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const uploadToClient = (event: React.FormEvent<HTMLInputElement>) => {
    const eventTarget = event.target as HTMLInputElement;

    if (eventTarget.files && eventTarget.files[0]) {
      const uploadedFile = eventTarget.files[0];

      setImage(uploadedFile);
      setCreateObjectURL(URL.createObjectURL(uploadedFile));
    }
  };

  const uploadToServer = async () => {
    if (!selectedImage || !inputNftName) {
      alert('Please upload an image and enter your NFT Name');
      return;
    }

    if (!walletAddress) {
      alert('Please connect your wallet!');
      return;
    }

    if (isMismatched && switchNetwork) {
      switchNetwork(ChainId.Mumbai);
      return;
    }

    setIsLoading(true);

    // const body = new FormData();
    // body.append('file', image);
    // body.append('image', selectedImage);
    // body.append('name', inputNftName);
    // body.append('walletAddress', walletAddress);
    const response = await fetch('/api/generate-mint-signature-json', {
      method: 'POST',
      body: JSON.stringify({
        name: inputNftName,
        walletAddress,
        image: selectedImage,
      }),
    })
      .then(handleFetchErrors)
      .then((res) => res.json())
      .catch((err) => {
        console.error(err.message);
        setIsLoading(false);
      });

    claimWithSignature(response.signature);
  };

  const claimWithSignature = async (
    signedPayload: SignedPayload721WithQuantitySignature
  ) => {
    setIsLoading(true);

    try {
      const nft = await contract?.signature.mint(signedPayload);
      alert(`Succesfully minted NFT ${nft?.id}!`);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert(`Failed to mint. Something went wrong`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-wrap items-center justify-center py-8 bg-black rounded-xl mt-6">
      <div className="w-3/4 px-4 bg-transparent">
        <div className="mb-12">
          {/* <label className="mb-3 block text-base font-medium text-center text-white">
            Upload your image here
          </label>
          <div className="relative">
            <label
              htmlFor="file"
              className="flex min-h-[175px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-primary p-6"
            >
              <div>
                <input
                  type="file"
                  name="file"
                  accept="image/png, image/gif, image/jpeg"
                  id="file"
                  className="sr-only"
                  onChange={uploadToClient}
                />
                <span className="mx-auto mb-3 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-stroke bg-white">
                  <ArrowUpTrayIcon className="w-8 h-8" />
                </span>
                <span className="text-base text-white">
                  Drag &amp; drop or{' '}
                  <span className="text-primary underline">browse</span>
                </span>
              </div>
            </label>
          </div> */}

          <h1 className="text-center text-white text-xl">Choose Your NFT</h1>
          <div className="w-full flex flex-wrap justify-around">
            {NftChoices.map((choice, index) => {
              return (
                <div
                  className={classNames(
                    'w-52 h-52 p-4 border-2 rounded-lg bg-transparent flex flex-col justify-center items-center my-2',
                    {
                      'border-2 border-primary-500': choice === selectedImage,
                    }
                  )}
                  onClick={() => {
                    setSelectedImage(choice);
                  }}
                  key={index}
                >
                  <Image
                    alt="doodle"
                    width={72}
                    height={72}
                    src={`/images/${choice}`}
                  ></Image>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center text-white w-3/4">
        <div className="mb-3 w-full">
          <label
            htmlFor="exampleFormControlInput1"
            className="form-label inline-block mb-2"
          >
            Your NFT Name
          </label>
          <input
            type="text"
            className="w-full form-control block px-3 py-1.5 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out text-black focus:text-gray-700 focus:bg-white focus:border-primary-300 focus:outline-none"
            id="nftName"
            placeholder="Your NFT Name"
            onChange={(e) => setInputNftName(e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        className={classNames(
          `mt-4 w-3/4 flex px-6 py-2.5 bg-primary-700 text-white font-medium text-xs leading-tight uppercase rounded shadow-md transition duration-150 ease-in-out justify-center`,
          {
            'bg-gray-400': isLoading,
            'hover:bg-blue-700 hover:shadow-lg': !isLoading,
            'focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg':
              !isLoading,
          }
        )}
        onClick={uploadToServer}
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : 'UPLOAD'}
      </button>
    </div>
  );
};

export default ImageUploader;
