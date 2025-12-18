export const WEBSITE_HOME= '/';
export const WEBSITE_LOGIN= '/auth/login';
export const WEBSITE_REGISTER= '/auth/register';
export const WEBSITE_RESET_PASSWORD= '/auth/reset-password';

//Use routes
export const USER_DASHBOARD = '/my-account';
export const WEBSITE_SHOP = '/shop';

export const WEBSITE_PRODUCT_DETAILS = (slug) => slug ? `/product/${slug}` : '/product';