export interface ITicketCategory {
  _id: string;
  name: string;
  color: string;
}

export class TicketCategory implements ITicketCategory {
  _id: string;
  name: string;
  color: string;

  private constructor() {}

  static fromJson(data: ITicketCategory): TicketCategory {
    const category = new TicketCategory();
    Object.assign(category, {
      _id: data._id,
      name: data.name,
      color: data.color,
    });
    return category;
  }

  toSave(): Partial<TicketCategory> {
    return {
      _id: this._id,
      name: this.name,
      color: this.color,
    };
  }
}
