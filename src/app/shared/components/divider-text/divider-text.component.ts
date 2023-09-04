import { Component, Input } from '@angular/core';
import { DivideTypes } from './divider-types.enum';

@Component({
  selector: 'app-divider-text',
  templateUrl: './divider-text.component.html',
  styleUrls: ['./divider-text.component.scss'],
})
export class DividerTextComponent {
  @Input() labelText: string = '';
  // @Input() typeDivider: DivideTypes | any = DivideTypes.solid;

  public get divideTypes(): typeof DivideTypes {
    return DivideTypes;
  }
}
