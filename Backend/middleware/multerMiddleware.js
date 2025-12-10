import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        return cd(null, "./public/temp");
    },
    filename: function (req, file, cd) {
        return cd(null, `${Date.now()}-${file.originalname}`)
    }
})

export const upload = multer({ storage: storage });