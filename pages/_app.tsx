import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainId } from '@thirdweb-dev/sdk';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import HomeLayout from '../layouts/HomeLayout';

const DEFAULT_CHAIN_ID = ChainId.Mumbai;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={DEFAULT_CHAIN_ID}>
      <HomeLayout>
        <Component {...pageProps} />
      </HomeLayout>
    </ThirdwebProvider>
  );
}
