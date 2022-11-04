import { ReactElement } from 'react';
import ImageUploader from '../components/ImageUploader';
import HomeLayout from '../layouts/HomeLayout';

export default function Home() {
  return <ImageUploader />;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};
