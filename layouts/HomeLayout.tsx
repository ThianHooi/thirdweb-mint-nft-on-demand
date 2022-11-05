import { ChildrenT } from '../types/Children';
import Header from './Header';
import MainView from './MainView';

type Props = ChildrenT;

const HomeLayout: React.FC<Props> = (props: Props) => {
  return (
    <div className='h-screen'>
      <Header />
      <MainView>{props.children}</MainView>
    </div>
  );
};

export default HomeLayout;
