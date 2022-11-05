import { ChildrenT } from '../types/Children';

type Props = ChildrenT;

const MainView: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="bg-background w-screen">
      <main>{children}</main>
    </div>
  );
};

export default MainView;
