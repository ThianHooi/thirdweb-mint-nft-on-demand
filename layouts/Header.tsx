import { ConnectWallet } from '@thirdweb-dev/react';

const Header = () => {
  const styles = {
    wrapper: 'flex items-center justify-end p-4 border-b-2 bg-primary-400',
    titleWrapper: 'grow flex justify-center',
    title: 'font-bold text-lg capitalize',
  };

  return (
    <header className={styles.wrapper}>
      <ConnectWallet accentColor="#4A23A4" />
    </header>
  );
};

export default Header;
