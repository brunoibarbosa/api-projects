const swaggerAutogen = require('swagger-autogen')();

const outputFile = './src/swagger_output.json';
const endpointsFiles = ['./src/app.js'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'API Portfólio de Projetos',
    description: 'API desenvolvida para o gerenciamento de portfólio de projetos.',
  },
  host: process.env.APP_URL,
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'User' },
    { name: 'User Group' },
    { name: 'User Group Permission' },
    { name: 'Category' },
    { name: 'Project' },
    { name: 'Project Image' },
    { name: 'Account Recovery' },
    { name: 'Token' },
  ],
  securityDefinitions: {
    bearerToken: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
    },
  },
  definitions: {
    User: {
      id: 0,
      name: 'string',
      email: 'user@mail.com',
      active: true,
      group: {
        id: 0,
        description: 'string',
      },
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-01-01T00:00:00.000Z',
    },
    UserGroup: {
      id: 0,
      description: 'string',
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-01-01T00:00:00.000Z',
    },
    Permissions: {
      id: 0,
      route_number: 0,
      can_create: true,
      can_read: false,
      can_update: true,
      can_delete: true,
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-01-01T00:00:00.000Z',
    },
    Category: {
      id: 0,
      description: 'string',
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-01-01T00:00:00.000Z',
      projects: [
        {
          id: 0,
          title: 'string',
          description: 'string',
          project_date: '2022-01-01T00:00:00.000Z',
          images: [
            {
              path: 'string',
              id: 0,
              description: 'string',
              originalname: 'string',
              filename: 'string',
              favorite: true,
            },
          ],
        },
      ],
    },
    AccountRecovery: {
      id: 0,
      valid: false,
      user_id: 0,
      token: 'string',
      used: true,
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-01-01T00:00:00.000Z',
    },
    Project: {
      id: 2,
      title: 'string',
      description: 'string',
      project_date: '2022-01-01T00:00:00.000Z',
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-01-01T00:00:00.000Z',
      images: [
        {
          path: 'string',
          id: 0,
          description: 'string',
          originalname: 'string',
          filename: 'string',
          favorite: true,
        },
      ],
      categories: [
        {
          id: 0,
          description: 'string',
        },
      ],
    },
    ProjectImage: {
      path: 'string',
      id: 0,
      originalname: 'string',
      filename: 'string',
      description: 'string',
      project_id: 0,
      favorite: true,
      updated_at: '2022-01-01T00:00:00.001Z',
      created_at: '2022-01-01T00:00:00.001Z',
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
