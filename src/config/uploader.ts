import { Request } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (request: Request, file, callBack) {
    let destinationFolder;

    if (file.mimetype.startsWith("video/")) {
      destinationFolder = path.join(__dirname, "..", "..", "uploads", "videos");
    } else if (file.mimetype.startsWith("audio/")) {
      destinationFolder = path.join(__dirname, "..", "..", "uploads", "audios");
    } else {
      destinationFolder = path.join(__dirname, "..", "..", "uploads", "photos");
    }

    callBack(null, destinationFolder);
  },
  filename: function (request:Request, file, callBack) {
    const { userEmail } = request.body;

    callBack(null,Date.now() + "_" + file.originalname)
    //callBack(null, userEmail+file.originalname);
  },
});

const photoUpload = multer({
  storage: storage,
  limits: {
    // Até 9 arquivos de 50 MB
    fileSize: 1024 * 1024 * 50,
    files: 9,
  },
  fileFilter: function (request: Request, file, callBack) {
    const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedFileTypes.includes(file.mimetype)) {
      const messsage = "Only the Jpeg, PNG and JPG types are supported";

      return callBack(new Error());
    }

    callBack(null, true); // Aceita o arquivo, caso seja do tipo suportado
  },
});

const audioUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 7,
    files: 10,
  },
  fileFilter: function (request, file, callBack) {
    const allowedAudioTypes = ["audio/mp3", "audio/m4a"];

    if (!allowedAudioTypes.includes(file.mimetype)) {
      const errorMessage = "Foi mal ae, apenas aceitamos MP3 e M4a";

      return callBack(new Error());
    }

    callBack(null, true);
  },
});

export { photoUpload, audioUpload };
