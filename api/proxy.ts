// api/proxy.js
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // 关键所在：iad1 代表美国华盛顿特区节点，强制在此运行
};

export default async function handler(req) {
  // 获取原始请求的 URL
  const url = new URL(req.url);
  
  // 偷天换日：把目标域名替换为 Gemini 官方域名
  url.hostname = 'generativelanguage.googleapis.com';
  url.port = '443';
  url.protocol = 'https:';

  // 构建新的请求头，伪装好身份，并清洗掉可能暴露你香港 VPS 的原始 IP 信息
  const headers = new Headers(req.headers);
  headers.set('host', 'generativelanguage.googleapis.com');
  headers.delete('x-forwarded-for');
  headers.delete('x-real-ip');

  // 原样转发请求，原生支持流式（Stream）输出
  return fetch(url.toString(), {
    method: req.method,
    headers: headers,
    body: req.body,
    redirect: 'manual'
  });
}
