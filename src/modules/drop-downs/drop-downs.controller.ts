import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PoliciesGuard } from '../casl/guards';
import { Action, CheckPolicies } from '../casl/decorators';
import { DropDownsByIdService, DropDownsService } from './services';
import { DropDownsParam, DropDownsParamById } from './drop-drowns.interface';

@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('drop-downs')
export class DropDownsController {
  constructor(
    private readonly dropDownsService: DropDownsService,
    private readonly dropDownsBYUdService: DropDownsByIdService,
  ) {}

  @Get(':param')
  @ApiParam({
    name: 'param',
    enum: DropDownsParam,
    description: 'Dropdown parameter',
  })
  @CheckPolicies((ability) => ability.can(Action.Read, 'DropDown'))
  getDropDown(
    @Param('param', new ParseEnumPipe(DropDownsParam)) param: DropDownsParam,
  ) {
    return this.dropDownsService.getDropDown(param);
  }

  @Get(':param/by-id/:id')
  @ApiParam({
    name: 'param',
    enum: DropDownsParamById,
    description: 'Dropdown parameter by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the dropdown item',
  })
  @CheckPolicies((ability) => ability.can(Action.Read, 'DropDown'))
  getDropDownById(
    @Param('param', new ParseEnumPipe(DropDownsParamById))
    param: DropDownsParamById,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.dropDownsBYUdService.getDropDownById(param, id);
  }
}
