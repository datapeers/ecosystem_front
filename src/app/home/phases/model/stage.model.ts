import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidRoles } from '@auth/models/valid-roles.enum';

export interface IStage {
  _id: string;
  index: number;
  name: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Stage implements IStage {
  _id: string;
  index: number;
  name: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJson(data: IStage): Stage {
    const stage = new Stage();
    Object.assign(stage, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return stage;
  }

  toSave(): Partial<Stage> {
    return {
      _id: this._id,
      index: this.index,
      label: this.label,
      name: this.name,
      color: this.color,
      icon: this.icon,
      description: this.description,
    };
  }
}

export function newStage(index: number, previous?: Stage) {
  return new FormGroup({
    _id: new FormControl<string>(previous?._id ?? undefined),
    index: new FormControl<number>(previous ? previous.index : index, {
      validators: [Validators.required],
    }),
    label: new FormControl<string>(previous?.label, {
      validators: [Validators.required],
    }),
    name: new FormControl<string>(previous?.name, {
      validators: [Validators.required],
    }),
    description: new FormControl<string>(previous?.description),
    color: new FormControl<string>(previous?.color ?? '#C54927'),
    icon: new FormControl<string>(previous?.icon ?? 'leaf'),
  });
}
