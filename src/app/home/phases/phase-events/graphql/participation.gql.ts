const fragments = {
  participationEventFields: `
  fragment participationEventFields on ParticipationEvent {
        _id
        event
        participant
        startup
        metadata
        createdAt
        updatedAt
    }
  `,
};

const query = {
  participationEvent: `
    query ParticipationEvent($event: String!, $participant: String!) {
      participationEvent(event: $event, participant: $participant) {
        ...participationEventFields
      }
    }
    ${fragments.participationEventFields}
  `,
  participationByEvent: `
    query ParticipationByEvent($event: String!) {
      participationByEvent(event: $event) {
        ...participationEventFields
      }
    }
    ${fragments.participationEventFields}
  `,
};

const mutation = {
  createParticipationEvent: `
    ${fragments.participationEventFields}
    mutation CreateParticipationEvent($createParticipationEventInput: CreateParticipationEventInput!) {
      createParticipationEvent(createParticipationEventInput: $createParticipationEventInput) {
        ...participationEventFields
      }
    }
  `,
  updateParticipantEvent: `
    ${fragments.participationEventFields}
    mutation UpdateParticipantEvent($updateParticipationEventInput: UpdateParticipationEventInput!) {
      updateParticipantEvent(updateParticipationEventInput: $updateParticipationEventInput) {
        ...participationEventFields
      }
    }
  `,
};

const participationEventQueries = {
  query,
  mutation,
};

export default participationEventQueries;
