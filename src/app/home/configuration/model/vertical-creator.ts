import { FormControl, FormGroup, Validators } from '@angular/forms';

export function newVertical(previous?: any) {
  return new FormGroup({
    name: new FormControl<number>(previous ? previous.name : '', {
      validators: [Validators.required],
    }),
    color: new FormControl<string>(previous?.color ?? '#C54927'),
    icon: new FormControl<string>(previous?.icon ?? 'leaf'),
  });
}
