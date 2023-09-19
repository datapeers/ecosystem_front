import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface IVertical {
  name: string;
  color: string;
  icon: string;
}

export function newVertical(previous?: IVertical) {
  return new FormGroup({
    name: new FormControl<string>(previous ? previous.name : '', {
      validators: [Validators.required],
    }),
    color: new FormControl<string>(previous?.color ?? '#C54927'),
    icon: new FormControl<string>(previous?.icon ?? 'leaf'),
  });
}
