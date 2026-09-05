import { createResourceSlice } from '@/store/createResourceSlice';
import { heroSchema, type Hero } from '@/schemas/cms';

const heroResource = createResourceSlice<Hero>('hero', 'hero', heroSchema);

export const fetchHero = heroResource.fetch;
export default heroResource.reducer;
