import { User } from '@prisma/client';


export interface ModelUser extends Omit<User, 'password'> {
    password?: string;
}