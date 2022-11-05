import {
  useContract,
  useContractMetadata,
  useTotalCount,
} from '@thirdweb-dev/react';

const CONTRACT_ADDRESS = '0xd1D4339FD664BCE5d7532143Cd86f2c98a3c9B59';

const ContractDetail = () => {
  const { contract, isLoading: isLoadingContract } = useContract(
    CONTRACT_ADDRESS,
    'nft-collection'
  );
  const { data: contractMetadata, isLoading: isLoadingMetadata } =
    useContractMetadata(contract);
  const { data: nftCount } = useTotalCount(contract);

  if (isLoadingContract || isLoadingMetadata) {
    return <p className="text-white text-2xl">Loading ...</p>;
  }

  return (
    <div className="flex flex-row justify-center items-center space-x-8 text-white">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl">{contractMetadata?.name}</h1>
        {/* <p className="text-xs">{contractMetadata?.description}</p> */}
        <p className="text-xl">Total NFT: {nftCount?.toNumber() ?? 0}</p>
      </div>

      {contractMetadata?.image && (
        <img className="max-w-xs" src={contractMetadata?.image} alt="" />
      )}
    </div>
  );
};

export default ContractDetail;
