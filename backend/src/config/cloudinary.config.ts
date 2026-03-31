import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dzegqm1au",
  api_key: "496451328232444",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
