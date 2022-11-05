import { ReactElement } from 'react';
import ContractDetail from '../components/ContractDetails';
import ImageUploader from '../components/ImageUploader';
import HomeLayout from '../layouts/HomeLayout';

export default function Home() {
  return (
    <div className='px-32'>
      <ContractDetail />
      <ImageUploader />
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};
