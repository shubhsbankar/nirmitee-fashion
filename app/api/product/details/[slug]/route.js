import { response, catchError } from '@/lib/helperFunctions';
import { getProductDetailsBySlug } from '../../../../../lib/getProductDetails';

export async function GET(request, { params }) {
  try {
    const getParams = await params;
    if (!getParams) {
      return response(false, 400, 'Missing params');
    }
    const rawSlug = getParams.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const searchParams = request.nextUrl.searchParams;
    const size = searchParams.get('size');
    const color = searchParams.get('color');

    const result = await getProductDetailsBySlug({ slug, size, color });

    if (!result.ok) {
      return response(false, result.status, result.message);
    }

    return response(true, 200, 'Product found.', result.data);
  } catch (error) {
    return catchError(error);
  }
}
