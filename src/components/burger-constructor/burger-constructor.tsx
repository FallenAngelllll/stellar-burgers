import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/slices/constructorSlice';
import {
  selectModalOrder,
  selectOrderRequestStatus,
  submitOrder,
  clearModalOrder
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  // Данные из конструктора
  const constructorItems = useSelector(selectConstructorItems);

  // Статус запроса и данные заказа
  const orderRequest = useSelector(selectOrderRequestStatus);
  const orderModalData = useSelector(selectModalOrder);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    dispatch(submitOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearModalOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
