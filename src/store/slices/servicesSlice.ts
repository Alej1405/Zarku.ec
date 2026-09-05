import { createResourceSlice } from '@/store/createResourceSlice';
import { servicesSchema, type Service } from '@/schemas/cms';

const servicesResource = createResourceSlice<Service[]>('services', 'services', servicesSchema);

export const fetchServices = servicesResource.fetch;
export default servicesResource.reducer;
