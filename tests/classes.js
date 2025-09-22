import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    ramping_test: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },  // sube a 10 usuarios en 30s
        { duration: '1m', target: 250 },   // sube hasta 150 en 1 min
        { duration: '1m', target: 250 },   // mantiene 150 usuarios por 1 min
        { duration: '30s', target: 0 },   // baja a 0 en 30s
      ],
      gracefulRampDown: '10s', // espera a que terminen requests pendientes
    },
  },

  thresholds: {
    // tasa de errores <1%
    http_req_failed: ['rate<0.01'],

    // 95% de requests deben responder en <500ms
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const url = `http://host.docker.internal:3001/api/classes/all?fecha=${formattedDate}`;

  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is not empty': (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}
