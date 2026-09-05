import { createResourceSlice } from '@/store/createResourceSlice';
import { faqListSchema, type Faq } from '@/schemas/cms';

const faqResource = createResourceSlice<Faq[]>('faq', 'faq', faqListSchema);

export const fetchFaq = faqResource.fetch;
export default faqResource.reducer;
