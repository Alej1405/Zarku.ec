import { createResourceSlice } from '@/store/createResourceSlice';
import { allEmpresaSchema, type Empresa } from '@/schemas/cms';

const empresaResource = createResourceSlice<Empresa>('empresa', 'all', allEmpresaSchema);

export const fetchEmpresa = empresaResource.fetch;
export default empresaResource.reducer;
