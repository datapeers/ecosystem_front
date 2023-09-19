import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface IBenefactor {
  name: string;
  image: string;
}

export function newBenefactor(previous?: IBenefactor) {
  return new FormGroup({
    name: new FormControl<string>(previous ? previous.name : '', {
      validators: [Validators.required],
    }),
    image: new FormControl<string>(previous ? previous.image : '', {
      validators: [Validators.required],
    }),
  });
}
