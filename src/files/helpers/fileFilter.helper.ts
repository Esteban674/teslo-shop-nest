
export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
  if(!file) return callback(new Error('File is empty'), false);
  
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    callback(null, true);
  } else {
    callback(new Error('File type not allowed'), false);
  }
}