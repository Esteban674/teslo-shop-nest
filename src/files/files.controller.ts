import { Controller, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Get, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid'
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile( path)
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file',
    {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000}
      storage: diskStorage(
        {
          destination: './static/products',
          filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${uuid()}.${fileExtension}`;
            cb(null, fileName);
          }
        }
      )
    }
  ))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {

    if(!file){
      throw new BadRequestException('Make sure that the file is an image file')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    };
  }
}
