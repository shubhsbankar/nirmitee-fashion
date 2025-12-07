import { response, catchError, isAuthenticated } from "@/lib/helperFunctions";
import connectDB from "@/lib/dbConnect";
import "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised");
    }
    await connectDB();

    const filter = {
      deletedAt: null,
    };

    const productvariant = await ProductVariantModel.find(filter)
      .populate("product", "name")
      .select("-media")
      .sort({ createdAt: -1 })
      .lean();

    const final = productvariant.map((item) => ({
      ...item,
      product: item.product?.name ?? null,
    }));
    if (!final) {
      return response(false, 404, "Collection empty.");
    }

    return response(true, 200, "Product found.", final);
  } catch (error) {
    return catchError(error);
  }
}
