import { createResourceSlice } from '@/store/createResourceSlice';
import { postsListSchema, type Post } from '@/schemas/cms';

/** Lista de noticias/blog del CMS (sin el cuerpo completo; eso va por slug). */
const postsResource = createResourceSlice<Post[]>('posts', 'posts', postsListSchema);

export const fetchPosts = postsResource.fetch;
export default postsResource.reducer;
