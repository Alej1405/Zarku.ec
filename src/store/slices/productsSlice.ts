import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiError } from '@/lib/api';
import { fetchAllProducts } from '@/lib/ecommerceApi';
import type { ResourceState } from '@/store/createResourceSlice';
import type { Product } from '@/schemas/ecommerce';

/**
 * Todos los productos del catálogo, planos. La API pagina de a 24; el thunk
 * recorre las páginas y guarda el array completo, así las derivaciones
 * (destacados, agregación de hijos, related) se hacen 100% en cliente.
 */
const initialState: ResourceState<Product[]> = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetch', async (_: void, { signal }) => {
  return fetchAllProducts(signal);
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
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

export default productsSlice.reducer;
