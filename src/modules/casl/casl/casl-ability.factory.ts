import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityClass,
  ConditionsMatcher,
  ExtractSubjectType,
  PureAbility,
} from '@casl/ability';
import {
  AppAbility,
  PermissionEntity,
  Subjects,
  UserLogged,
} from '../interfaces';
import { Action } from '../decorators';

const simpleConditionsMatcher: ConditionsMatcher<Record<string, any>> = (
  conditions,
) => {
  return (object: Record<string, any>): boolean => {
    console.log('object', object);
    return Object.entries(conditions).every(
      ([key, value]) => object[key] === value,
    );
  };
};

// TODO: Implementar conditions en un futuro para poder hacer validaciones más complejas
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserLogged): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.Profile && user.Profile.Permissions) {
      for (const perm of user.Profile.Permissions as PermissionEntity[]) {
        if (perm.type === 'cannot') {
          cannot(perm.action, perm.subject as ExtractSubjectType<Subjects>);
        } else {
          can(perm.action, perm.subject as ExtractSubjectType<Subjects>);
        }
      }
    }

    return build({
      // Permite que CASL identifique el tipo de sujeto usando la clase del objeto
      detectSubjectType: (item) =>
        (item as any).constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: simpleConditionsMatcher,
    });
  }
}
