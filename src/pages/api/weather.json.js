import { getWeather, weatherCacheTtlSeconds } from '../../lib/weather.js';

// 這支 API 佇伺服器端執行：前端干焦看會著正規化後的資料。
export const prerender = false;

export async function GET() {
  const data = await getWeather();

  const headers = {
    'content-type': 'application/json; charset=utf-8',
    // 予 CDN 佮瀏覽器做短期快取，順紲支援 stale-while-revalidate
    'cache-control': `public, max-age=300, s-maxage=${weatherCacheTtlSeconds}, stale-while-revalidate=1800`,
    'access-control-allow-origin': '*',
  };

  if (!data?.ok) {
    return new Response(JSON.stringify({ ok: false, error: 'weather_unavailable' }), {
      status: 503,
      headers: { ...headers, 'cache-control': 'no-store' },
    });
  }

  return new Response(JSON.stringify(data), { status: 200, headers });
}
