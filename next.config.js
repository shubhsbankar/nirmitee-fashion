const nextConfig =   {
  images:{ 
    remotePatterns:[{
      protocol: "https",
      hostname: "res.cloudinary.com",
      port:"",
      pathname:"/**",
      search:""
      }]
      }
      };
export default nextConfig;
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
};