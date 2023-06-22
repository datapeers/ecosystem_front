const fragments = {
  eventFields: `
  fragment eventFields on Event {
      _id
      name
      type
      phase
      extra_options
      startAt
      endAt
      experts {
        _id
        name
      }
      participants {
        _id
        name
      }
      isDeleted
      createdAt
      updatedAt
    }
  `,
};

const query = {
  getEvent: `
    query Event($id: String!) {
      event(id: $id) {
        ...eventFields
      }
    }
    ${fragments.eventFields}
  `,
  getEvents: `
    query Events {
      events {
        ...eventFields
      }
    }
    ${fragments.eventFields}
  `,
  getEventsPhase: `
    query EventsPhase($phase: String!) {
      eventsPhase(phase: $phase) {
        ...eventFields
      }
    }
    ${fragments.eventFields}
  `,
};

const mutation = {
  createEvent: `
    ${fragments.eventFields}
    mutation CreateEvent($createEventInput: CreateEventInput!) {
      createEvent(createEventInput: $createEventInput) {
        ...eventFields
      }
    }
  `,
  updateEvent: `
    ${fragments.eventFields}
    mutation UpdateEvent($updateEventInput: UpdateEventInput!) {
      updateEvent(updateEventInput: $updateEventInput) {
        ...eventFields
      }
    }
  `,
  deleteEvent: `
  ${fragments.eventFields}
    mutation RemoveEvent($id: String!) {
      removeEvent(id: $id) {
        ...eventFields
      } 
    }
`,
};

const eventsQueries = {
  query,
  mutation,
};

export default eventsQueries;
