import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedThunk, selectLoading, selectOrders } from '../../slices/feedSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);

  const handleGetFeeds = () => {
    dispatch(feedThunk());
  };

  useEffect(() => {
    dispatch(feedThunk());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
      )}
    </>
  );
};
