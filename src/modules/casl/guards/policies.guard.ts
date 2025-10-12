// policies.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '../decorators/check-policies.decorator';
import { AppAbility, UserLogged } from '../interfaces';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Se extraen los policy handlers configurados en el endpoint
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const req = context.switchToHttp().getRequest();
    const user = req.user as UserLogged;
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }
    // Se crea la ability del usuario según su rol y condiciones
    const ability: AppAbility = this.caslAbilityFactory.createForUser(user);

    // Se ejecuta cada política; si alguna falla, se deniega el acceso
    const isAllowed = policyHandlers.every((handler) => handler(ability));
    if (!isAllowed) {
      throw new ForbiddenException(
        `El perfil del usuario: '${user.Profile.name}' no permite esta acción`,
      );
    }
    return true;
  }
}
