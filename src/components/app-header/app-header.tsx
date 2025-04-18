import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/authorizationSlice';

export const AppHeader: FC = () => {
  const currentUser = useSelector(selectUser);

  // Извлекаем имя пользователя, если оно присутствует
  const displayName = currentUser?.name;

  return <AppHeaderUI userName={displayName} />;
};
