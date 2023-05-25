export class UpdateResultPayload {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: string;
}

export const updateResultPayloadFields = `
  fragment updateResultPayloadFields on UpdateResultPayload {
    acknowledged
    matchedCount
    modifiedCount
    upsertedCount
    upsertedId
  }
`;