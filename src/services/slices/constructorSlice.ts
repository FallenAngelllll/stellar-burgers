import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface IConstructorState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: IConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.constructorItems.ingredients.push(action.payload);
    },

    // Полностью заменяет массив начинок
    setItems(state, action: PayloadAction<TConstructorIngredient[]>) {
      state.constructorItems.ingredients = action.payload;
    },

    // Удаляет одну начинку по индексу
    removeItem(state, action: PayloadAction<number>) {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },

    // Перемещает элемент ингредиентов из позиции from в to
    reorderItem(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const items = state.constructorItems.ingredients;
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
    },

    // Сбрасывает всё к initialState
    resetConstructor: () => initialState
  }
});

export const {
  addBun,
  addIngredient,
  setItems,
  removeItem,
  reorderItem,
  resetConstructor
} = constructorSlice.actions;

export const selectConstructorItems = (state: RootState) =>
  state.builder.constructorItems;

export const selectBun = (state: RootState) =>
  selectConstructorItems(state).bun;

export const selectIngredients = (state: RootState) =>
  selectConstructorItems(state).ingredients;

export const constructorReducer = constructorSlice.reducer;
