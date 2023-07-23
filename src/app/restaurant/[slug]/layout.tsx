import Header from './components/Header';

interface Props {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}
const RestaurantLayout = ({ children, params }: Props) => {
  const { slug } = params;

  return (
    <main>
      <Header name={slug} />
      <div className='flex m-auto w-2/3 justify-between items-start 0 -mt-11'>
        {children}
      </div>
    </main>
  );
};

export default RestaurantLayout;
