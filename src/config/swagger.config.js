const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medical-Appointment-System',
      version: '1.0.0',
      description: "a simple api about booking doctors' appointments",
    },
    servers: [
      {
        url: '/',
      },
    ],
  },
  apis: ['./src/**/*.js']
};

const specs=swaggerJsdoc(options)

module.exports=specs