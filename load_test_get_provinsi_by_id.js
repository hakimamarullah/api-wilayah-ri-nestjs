import http from 'k6/http';
import { check } from 'k6';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '60s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(100)<10000'], // 99% of requests should be below 10s
  },
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function() {
  const res = http.get('http://localhost:3000/api/wilayah/provinsi/19');

  check(res, {
    'response code was 200': (res) => res.status === 200,
    'response code was 500': (res) => res.status === 500,
  });

}
