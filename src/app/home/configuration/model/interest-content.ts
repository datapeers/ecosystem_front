import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface IInterestContent {
  name: string;
  image: string;
  description: string;
}

export function newInterestContent(previous?: IInterestContent) {
  return new FormGroup({
    name: new FormControl<string>(previous ? previous.name : '', {
      validators: [Validators.required],
    }),
    image: new FormControl<string>(previous?.image ?? ''),
    description: new FormControl<string>(previous?.description ?? ''),
  });
}
