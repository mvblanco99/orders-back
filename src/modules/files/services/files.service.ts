import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { writeFile, unlink, mkdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { envs } from 'src/modules/config';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly publicPath = join(process.cwd(), 'uploads');

  constructor() {}

  async saveFile(
    file: Express.Multer.File,
    subfolder: string,
  ): Promise<string> {
    const destination = join(this.publicPath, 'images', subfolder);

    // Asegurarse de que el directorio de destino exista
    try {
      await stat(destination);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await mkdir(destination, { recursive: true });
      }
    }

    const lowerFileName = file.filename.toLowerCase(); 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}${extname(lowerFileName)}`;
    const fullPath = join(destination, filename);

    try {
      await writeFile(fullPath, file.buffer);
      return `images/${subfolder}/${filename}`;
    } catch (error) {
      this.logger.error(
        `Error al guardar el archivo: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('No se pudo guardar el archivo.');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl) return;

      // Si la URL incluye la base pública, la removemos.
      let relativePath = fileUrl;
      if (fileUrl.startsWith(envs.baseUrl)) {
        relativePath = fileUrl.replace(envs.baseUrl, '');
      }

      // Limpiar slashes al inicio para evitar problemas con join
      relativePath = relativePath.replace(/^\/+/, '');

      // El archivo se guarda en uploads/images/..., por eso unimos con publicPath
      const fullPath = join(this.publicPath, relativePath);

      await unlink(fullPath);
    } catch (error) {
      // Si el archivo no existe, no hacemos nada.
      if (error && (error as any).code === 'ENOENT') {
        this.logger.warn(
          `Se intentó borrar un archivo que no existe: ${fileUrl}`,
        );
        return;
      }
      this.logger.error(
        `Error al eliminar el archivo: ${(error as any).message}`,
        (error as any).stack,
      );
      throw new InternalServerErrorException('Error al eliminar el archivo.');
    }
  }
}
