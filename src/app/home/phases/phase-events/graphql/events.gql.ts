const fragments = {
  eventFields: `
  fragment eventFields on Event {
    _id
    name
    type
    attendanceType
    description
    extra_options
    startAt
    endAt
    isCanceled
    isDeleted
    createdAt
    updatedAt
    batch
    experts {
      _id
      name
    }
    teamCoaches {
      _id
      name
    }
    participants {
      _id
      name
    }
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
  getEventsBatch: `
    query EventsBatch($batch: String!) {
      eventsBatch(batch: $batch) {
        ...eventFields
      }
    }
    ${fragments.eventFields}
  `,
  getEventsUser: `
    query EventsUser {
      eventsUser {
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
