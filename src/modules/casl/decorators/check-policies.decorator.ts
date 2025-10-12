import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '../interfaces';
export const CHECK_POLICIES_KEY = 'check_policy';

export enum Action {
  Manage = 'manage', // representa cualquier acción
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete', // aunque en nuestro caso nunca se permitirá
}

// El decorador recibe uno o más "policy handlers" (en este ejemplo usaremos funciones)
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

export type PolicyHandler = (ability: AppAbility) => boolean;
