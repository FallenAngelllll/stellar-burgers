import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { RootState } from 'src/services/store';

interface OrdersState {
  ordersList: TOrder[];
  isCreatingOrder: boolean;
  requestError: string | null;
  modalOrder: TOrder | null;
  isLoadingByNumber: boolean;
  isFetchingOrders: boolean;
}

const initialState: OrdersState = {
  ordersList: [],
  isCreatingOrder: false,
  requestError: null,
  modalOrder: null,
  isLoadingByNumber: false,
  isFetchingOrders: false
};

// Создание нового заказа
export const submitOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('orders/submitOrder', async (ingredients, { rejectWithValue }) => {
  try {
    return await orderBurgerApi(ingredients);
  } catch (err) {
    return rejectWithValue(
      (err as { message?: string }).message || 'Не удалось создать заказ'
    );
  }
});

// Получение заказа по номеру
export const getOrderDetails = createAsyncThunk<TOrder, number>(
  'orders/getByNumber',
  async (orderNumber, { rejectWithValue }) => {
    const res = await getOrderByNumberApi(orderNumber);
    return res.success ? res.orders[0] : rejectWithValue(res);
  }
);

// Получение всех заказов
export const getAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async () => await getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearModalOrder(state) {
      state.modalOrder = null;
      state.isCreatingOrder = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoadingByNumber = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoadingByNumber = false;
        state.modalOrder = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoadingByNumber = false;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.isFetchingOrders = true;
        state.requestError = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isFetchingOrders = false;
        state.ordersList = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isFetchingOrders = false;
        state.requestError = action.error.message ?? 'Произошла ошибка';
      })
      .addCase(submitOrder.pending, (state) => {
        state.isCreatingOrder = true;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.isCreatingOrder = false;
        state.modalOrder = action.payload.order;
      })
      .addCase(submitOrder.rejected, (state) => {
        state.isCreatingOrder = false;
      });
  }
});

// Селекторы
export const selectOrders = (state: RootState) => state.order.ordersList;
export const selectModalOrder = (state: RootState) => state.order.modalOrder;
export const selectOrderRequestStatus = (state: RootState) =>
  state.order.isCreatingOrder;

export const findOrderByNumber = (number: string) => (state: RootState) => {
  const targetNumber = Number(number);

  return (
    state.order.ordersList.find(
      (order: TOrder) => order.number === targetNumber
    ) ||
    state.feed.data?.orders?.find(
      (order: TOrder) => order.number === targetNumber
    ) ||
    (state.order.modalOrder?.number === targetNumber
      ? state.order.modalOrder
      : null)
  );
};

export const { clearModalOrder } = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;
