import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { CustomValidators } from '@shared/forms/custom-validators';

export interface IConfigEvaluation {
  _id?: string;
  title: string;
  description: string;
  evaluated: ValidRoles;
  reviewer: ValidRoles;
  form: string;
  phase: string;
  startAt: Date;
  endAt: Date;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class ConfigEvaluation implements IConfigEvaluation {
  _id?: string;
  title: string;
  description: string;
  evaluated: ValidRoles;
  reviewer: ValidRoles;
  form: string;
  phase: string;
  startAt: Date;
  endAt: Date;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  constructor() {}

  static fromJson(data: IConfigEvaluation): ConfigEvaluation {
    const obj = new ConfigEvaluation();
    Object.assign(obj, {
      ...data,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return obj;
  }
}

export function newConfigEvaluation(
  phase: string,
  previous?: ConfigEvaluation
) {
  return new FormGroup(
    {
      _id: new FormControl<string>(previous?._id ?? undefined),
      phase: new FormControl<string>(phase, {
        validators: [Validators.required],
      }),
      title: new FormControl<string>(previous?.title, {
        validators: [Validators.required],
      }),
      description: new FormControl<string>(previous?.description ?? ''),
      reviewer: new FormControl<ValidRoles>(previous?.reviewer, {
        validators: [Validators.required],
      }),
      evaluated: new FormControl<ValidRoles>(previous?.evaluated, {
        validators: [Validators.required],
      }),
      form: new FormControl<string>(previous?.form, {
        validators: [Validators.required],
      }),
      startAt: new FormControl<Date>(previous?.startAt, {
        validators: [Validators.required],
      }),
      endAt: new FormControl<Date>(previous?.endAt, {
        validators: [Validators.required],
      }),
    },
    {
      validators: [
        CustomValidators.MatchValidator('startAt', 'endAt'),
        CustomValidators.avoidMatchValidator('evaluated', 'reviewer'),
      ],
    }
  );
}
