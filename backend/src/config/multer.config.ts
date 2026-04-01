import multer from "multer";
import path from "path";

// Define saving destination & file name
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "public/uploads");
//   },

//   filename: (req, file, callback) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     callback(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
//     );
//   },
// });

const storage = multer.memoryStorage();

// Filter --> image only
const fileFilter = (req: any, file: any, callback: any) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return callback(new Error("Only jpg, png, webp allowed"));
  }
  callback(null, true);
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 mb max
  fileFilter: fileFilter,
});
