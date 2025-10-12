import { PureAbility } from '@casl/ability';

import { ModelUser } from '../../auth/interfaces/model-auth.interface';
import { Action } from '../decorators/check-policies.decorator';

export enum SubjectsEnum {
  DropDown = 'DropDown',
  User = 'User',
  Profile = 'Profile',
  Permission = 'Permission',
  MenuItems = 'MenuItems',
  Category = 'Category',
  Tag = 'Tag',
  Post = 'Post',
  Comment = 'Comment',
  PostReaction = 'PostReaction',
  CommentReaction = 'CommentReaction',
  Bookmark = 'Bookmark',
  FollowAuthor = 'FollowAuthor',
  All = 'all',
}

export type Subjects = keyof typeof SubjectsEnum;

// Definimos el tipo de Ability que usará la aplicación
export type AppAbility = PureAbility<[Action, Subjects]>;

export interface PermissionEntity {
  type: 'can' | 'cannot'; // Puedes agregar esta propiedad en la tabla o asumir que todos son "can" salvo que se defina lo contrario.
  action: Action;
  subject: Subjects;
  conditions?: any;
}

export interface UserLogged extends ModelUser {
  Profile: {
    id: number;
    name: string;
    Permissions: PermissionEntity[];
  };
}
