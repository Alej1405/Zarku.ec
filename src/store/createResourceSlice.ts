import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { z } from 'zod';
import { ApiError, fetchResource } from '@/lib/api';

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ResourceState<T> {
  data: T | null;
  status: Status;
  error: string | null;
}

/**
 * Fábrica de slices de recurso del CMS. Cada llamada produce un slice
 * independiente (su propio reducer + thunk) que:
 *  1. llama a la API,
 *  2. valida con Zod dentro de fetchResource,
 *  3. guarda data | error + status para loaders/skeletons.
 */
export function createResourceSlice<T>(
  name: string,
  path: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
) {
  const initialState: ResourceState<T> = {
    data: null,
    status: 'idle',
    error: null,
  };

  const fetchThunk = createAsyncThunk(`${name}/fetch`, async (_: void, { signal }) => {
    return fetchResource<T>(path, schema, signal);
  });

  const slice = createSlice({
    name,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchThunk.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload as typeof state.data;
        })
        .addCase(fetchThunk.rejected, (state, action) => {
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

  return { reducer: slice.reducer, fetch: fetchThunk };
}
