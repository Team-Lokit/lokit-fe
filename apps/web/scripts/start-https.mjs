// 프로덕션 빌드를 https://local.lokit.co.kr 로 띄운다.
// 인증 쿠키가 *.lokit.co.kr 도메인이라 localhost에서는 로그인이 안 되기 때문에,
// `next dev --experimental-https`가 만든 인증서를 재사용해 HTTPS로 서빙한다.
import { readFileSync } from 'node:fs';
import { createServer } from 'node:https';
import next from 'next';

const hostname = 'local.lokit.co.kr';
const port = Number(process.env.PORT) || 3000;

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

createServer(
  {
    key: readFileSync(new URL('../certificates/localhost-key.pem', import.meta.url)),
    cert: readFileSync(new URL('../certificates/localhost.pem', import.meta.url)),
  },
  (req, res) => handle(req, res),
).listen(port, () => {
  console.log(`> Ready on https://${hostname}:${port}`);
});
