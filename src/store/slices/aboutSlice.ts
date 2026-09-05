import { createResourceSlice } from '@/store/createResourceSlice';
import { aboutSchema, type About } from '@/schemas/cms';

const aboutResource = createResourceSlice<About>('about', 'about', aboutSchema);

export const fetchAbout = aboutResource.fetch;
export default aboutResource.reducer;
