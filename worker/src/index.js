// パス方式マルチゾーンのルーター Worker。
// karatsu-civictech.org/<path> を各アプリ（別 Cloudflare Pages）へ転送する。
// 各アプリは base:'/<path>' でビルドされているので、同じパスのまま origin に渡す。

const ROUTES = [
  { prefix: '/gikai', origin: 'https://karatsu-gikai.pages.dev' },
  // 例: { prefix: '/bousai', origin: 'https://karatsu-bousai.pages.dev' },
];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    for (const { prefix, origin } of ROUTES) {
      if (url.pathname === prefix || url.pathname.startsWith(prefix + '/')) {
        const target = new URL(url.pathname + url.search, origin);
        return fetch(new Request(target, request));
      }
    }
    // ルート対象外（通常は Worker ルートが /gikai* のみなのでここには来ない）
    return fetch(request);
  },
};
