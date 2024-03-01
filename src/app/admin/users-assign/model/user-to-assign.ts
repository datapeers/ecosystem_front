import { User } from '@auth/models/user';

export class UserAssign extends User {
  phases: string;
  batches: string;
  startups: string;

  constructor(user, phases: string[], batches: string[]) {
    super(user);
    Object.assign(this, user);
    if (!this.relationsAssign || Object.keys(this.relationsAssign).length === 0)
      this.relationsAssign = {
        phases: [],
        batches: [],
        startups: [],
      };

    if (this.relationsAssign?.phases)
      this.relationsAssign.phases = this.relationsAssign?.phases.filter((i) =>
        phases.includes(i._id)
      );
    if (this.relationsAssign?.batches)
      this.relationsAssign.batches = this.relationsAssign?.batches.filter((i) =>
        batches.includes(i._id)
      );

    const listPhasesNames = this.relationsAssign?.phases.map((i) => i.name);
    const listBatchesNames = this.relationsAssign?.batches.map((i) => i.name);
    const listStartupsNames = this.relationsAssign?.startups.map((i) => i.name);
    this.phases = listPhasesNames.join(', ');
    this.batches = listBatchesNames.join(', ');
    this.startups = listStartupsNames.join(', ');
  }

  get getPhases() {
    return this.relationsAssign.phases;
  }

  get getBatches() {
    return this.relationsAssign.batches;
  }

  get getStartups() {
    return this.relationsAssign.startups;
  }
}
