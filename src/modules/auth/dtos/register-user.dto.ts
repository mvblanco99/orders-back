import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({ description: 'Nombre del usuario', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'ID del perfil del usuario',
    required: false,
  })
  @IsOptional()
  profileId: number;
}
