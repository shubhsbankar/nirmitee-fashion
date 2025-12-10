import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Chip from '@mui/material/Chip';
import * as dayjs from 'dayjs';
import userIcon from '@/public/assets/images/user.png';

export const DT_CATEGORY_COLUMN = [
  {
    accessorKey: "name", //access nested data with dot notation
    header: "Category Name",
  },
  {
    accessorKey: "slug", //access nested data with dot notation
    header: "Slug",
  },
   {
    accessorKey: "isSubcategory", //access nested data with dot notation
    header: "isSubcategory",
    Cell: ({ renderedCellValue }) => (<Chip
        color='default'
        variant='outlined'
        label={!renderedCellValue ? "Category" : "SubCategory"}
      />)
  },
  {
    accessorKey: "parent", //access nested data with dot notation
    header: "Parent Category",
  },
];

export const DT_PRODUCT_COLUMN = [
  {
    accessorKey: "name", //access nested data with dot notation
    header: "Category Name",
  },
  {
    accessorKey: "slug", //access nested data with dot notation
    header: "Slug",
  },
  {
    accessorKey: "category", //access nested data with dot notation
    header: "Category",
  },
  {
    accessorKey: "mrp", //access nested data with dot notation
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice", //access nested data with dot notation
    header: "SellingPrice",
  },
  {
    accessorKey: "discountPercentage", //access nested data with dot notation
    header: "DiscountPercentage",
  },
];

export const DT_PRODUCT_VARIANT_COLUMN = [
  {
    accessorKey: "product", //access nested data with dot notation
    header: "Product",
  },
  {
    accessorKey: "color", //access nested data with dot notation
    header: "Color",
  },
  {
    accessorKey: "sku", //access nested data with dot notation
    header: "SKU",
  },
  {
    accessorKey: "mrp", //access nested data with dot notation
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice", //access nested data with dot notation
    header: "SellingPrice",
  },
  {
    accessorKey: "discountPercentage", //access nested data with dot notation
    header: "DiscountPercentage",
  },
  {
    accessorKey: "size", //access nested data with dot notation
    header: "Size",
  },
  {
    accessorKey: "stock", //access nested data with dot notation
    header: "Stock",
  },
];

export const DT_COUPON_COLUMN = [
  {
    accessorKey: "code", //access nested data with dot notation
    header: "Code",
  },

  {
    accessorKey: "minShoppingAmount", //access nested data with dot notation
    header: "Min. Shopping Amount",
  },
  {
    accessorKey: "discountPercentage", //access nested data with dot notation
    header: "Discount Percentage",
  },
  {
    accessorKey: "validity",
    header: "Validity",
    Cell: ({ renderedCellValue }) => {
      const value = renderedCellValue;
      const today = new Date();
      const dateValue = new Date(value); // parse ISO string

      const isExpired = !isNaN(dateValue) && today > dateValue;

      return (
        <Chip
          color={isExpired ? "error" : "success"}
          label={dayjs(value).format('DD/MM/YYYY')}
        />
      );
    },
  },

];


export const DT_CUSTOMERS_COLUMN = [
  {
    accessorKey: "avtar", //access nested data with dot notation
    header: "Avatar",
    Cell: ({ renderedCellValue }) => (<Avatar>
      <AvatarImage src={renderedCellValue?.url || userIcon.src} />
    </Avatar>
    )
  },

  {
    accessorKey: "fullName", //access nested data with dot notation
    header: "Full Name",
  },
  {
    accessorKey: "email", //access nested data with dot notation
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "isEmailVerified",
    header: "Is Verified",
    Cell: ({ renderedCellValue }) => (
      <>
      {console.log('renderedCellValue',renderedCellValue)}
      <Chip
        color={!renderedCellValue ? "error" : "success"}
        label={!renderedCellValue ? "Not Verified" : "Verified"}
      />
      </>
    )
  },
];

export const DT_REVIEW_COLUMN = [
  {
    accessorKey: "product", //access nested data with dot notation
    header: "Product",
  },
  {
    accessorKey: "user", //access nested data with dot notation
    header: "User",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "review",
    header: "Review",
  },
];
