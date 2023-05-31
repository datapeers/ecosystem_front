export interface IStage {
  _id: string;
  name: string;
  label: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Stage implements IStage {
  _id: string;
  name: string;
  label: string;
  color: string;
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
      label: this.label,
      name: this.name,
      color: this.color,
    };
  }

  static newStage(): Partial<Stage> {
    return {
      label: '',
      name: '',
      color: '#C54927',
    };
  }
}
