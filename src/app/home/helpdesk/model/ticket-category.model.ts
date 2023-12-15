export interface ITicketCategory {
  name: string;
  color: string;
}

export class TicketCategory implements ITicketCategory {
  name: string;
  color: string;

  private constructor() {}

  static fromJson(data: ITicketCategory): TicketCategory {
    const category = new TicketCategory();
    Object.assign(category, {
      name: data.name,
      color: data.color,
    });
    return category;
  }

  toSave(): Partial<TicketCategory> {
    return {
      name: this.name,
      color: this.color,
    };
  }
}
