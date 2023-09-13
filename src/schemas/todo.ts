export const todo = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        done: { type: 'boolean' },
    },
    required: ['name'],
} as const; // don't forget to use const !
