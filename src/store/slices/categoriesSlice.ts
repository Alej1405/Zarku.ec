import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiError } from '@/lib/api';
import { fetchCategories } from '@/lib/ecommerceApi';
import type { ResourceState } from '@/store/createResourceSlice';
import type { Category } from '@/schemas/ecommerce';

/**
 * Árbol de categorías (solo padres, con `children[]` anidados). El endpoint
 * ya trae conteos y banners; los conteos reales agregados se recalculan en
 * cliente contra los productos (ver lib/catalog.ts).
 */
const initialState: ResourceState<Category[]> = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchCategoriesThunk = createAsyncThunk(
  'categories/fetch',
  async (_: void, { signal }) => {
    return fetchCategories(signal);
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error =
          action.error.message ??
          (action.error instanceof ApiError
            ? action.error.message
            : 'Ocurrió un error inesperado.');
      });
  },
});

export default categoriesSlice.reducer;
