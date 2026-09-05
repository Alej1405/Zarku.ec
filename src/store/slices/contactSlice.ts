import { createResourceSlice } from '@/store/createResourceSlice';
import { contactSchema, type Contact } from '@/schemas/cms';

const contactResource = createResourceSlice<Contact>('contact', 'contact', contactSchema);

export const fetchContact = contactResource.fetch;
export default contactResource.reducer;
