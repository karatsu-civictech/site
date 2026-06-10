// 旧ドメインへのアクセスを、パスとクエリを保ったまま新ドメインへ 301 で転送する。
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.hostname = 'civictech-karatsu.org';
    return Response.redirect(url.toString(), 301);
  },
};
