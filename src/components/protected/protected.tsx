import React, { FC, ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { useLocation, Navigate } from 'react-router-dom';
import {
  selectAuthChecked,
  selectUser
} from '../../services/slices/authorizationSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isChecked = useSelector(selectAuthChecked);
  const currentUser = useSelector(selectUser);
  const location = useLocation();

  // Пока не завершена проверка авторизации — показываем прелоадер
  if (!isChecked) {
    return <Preloader />;
  }

  // Если страница доступна только неавторизованным, а пользователь авторизован — редиректим
  if (onlyUnAuth && currentUser) {
    const redirectPath = location.state?.from?.pathname || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // Если страница доступна только авторизованным, а пользователь не авторизован — редиректим на логин
  if (!onlyUnAuth && !currentUser) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
