import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { ProtectedRoute } from '../protected/protected';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUser } from '../../services/slices/authorizationSlice';
import { useDispatch } from '../../services/store';
import { clearModalOrder } from '../../services/slices/orderSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  const orderIdFromProfile = useMatch('/profile/orders/:number')?.params.number;
  const orderIdFromFeed = useMatch('/feed/:number')?.params.number;
  const currentOrderId = orderIdFromProfile || orderIdFromFeed;

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleCloseModal = () => {
    dispatch(clearModalOrder());
    navigate(-1);
  };

  const renderOrderTitle = () =>
    currentOrderId ? `#${currentOrderId.padStart(6, '0')}` : '';

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <h2
                className={`text text_type_main-large ${styles.detailHeader}`}
              >
                Детали ингредиента
              </h2>
              <IngredientDetails />
            </div>
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <h2
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                {renderOrderTitle()}
              </h2>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <div className={styles.detailPageWrap}>
              <h2
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                {renderOrderTitle()}
              </h2>
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            </div>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={renderOrderTitle()} onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={renderOrderTitle()} onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
