import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DropDown,
  DropDownsExecuteById,
  DropDownsParamById,
} from '../drop-drowns.interface';

@Injectable()
export class DropDownsByIdService {
  private readonly executeById: DropDownsExecuteById = {
  };

  constructor(private readonly prismaService: PrismaService) {}

  async getDropDownById(param: DropDownsParamById, id: number) {
    const executeFunction = this.executeById[param];
    if (!executeFunction) {
      throw new NotFoundException(`Dropdown for ${param} not found`);
    }
    return executeFunction(id);
  }
}
