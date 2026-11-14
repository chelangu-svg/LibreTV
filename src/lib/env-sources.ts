import type { SourceConfig } from './types';

/**
 * 部署者通过 DEFAULT_SOURCES 环境变量预置的采集站。
 * 格式为 JSON 数组：[{"name":"源名","url":"https://.../api.php/provide/vod","detail":"https://...","isAdult":false}]
 * 解析失败时告警并整体忽略，不影响站点运行。
 */
export function getEnvSources(): SourceConfig[] {
  
const raw = JSON.stringify([
  {
    name: "速播资源",
    url: "https://subocaiji.com/api.php/provide/vod"
  },
  {
    name: "金鹰点播",
    url: "https://jinyingzy.com/api.php/provide/vod"
  },
  {
    name: "飘零资源",
    url: "https://p2100.net/api.php/provide/vod"
  },
  {
    name: "无尽资源",
    url: "https://api.wujinapi.com/api.php/provide/vod"
  },
  {
    name: "魔都动漫",
    url: "https://caiji.moduapi.cc/api.php/provide/vod"
  },
  {
    name: "暴风资源",
    url: "https://bfzyapi.com/api.php/provide/vod"
  },
  {
    name: "量子资源",
    url: "https://cj.lziapi.com/api.php/provide/vod/"
  },
  {
    name: "360资源",
    url: "https://360zy.com/api.php/provide/vod"
  },
  {
    name: "非凡资源",
    url: "http://api.ffzyapi.com/api.php/provide/vod"
  },
  {
    name: "红牛资源",
    url: "https://www.hongniuzy2.com/api.php/provide/vod"
  }
]);

  if (!raw || !raw.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('必须是 JSON 数组');
    const list: SourceConfig[] = parsed.map((item, i) => {
      if (typeof item !== 'object' || item === null) {
        throw new Error(`第 ${i + 1} 项不是对象`);
      }
      const { name, url, detail, isAdult } = item as Record<string, unknown>;
      if (typeof name !== 'string' || !name.trim()) {
        throw new Error(`第 ${i + 1} 项缺少 name`);
      }
      if (typeof url !== 'string' || !/^https?:\/\//.test(url.trim())) {
        throw new Error(`第 ${i + 1} 项的 url 必须以 http:// 或 https:// 开头`);
      }
      return {
        key: `env_${i}`,
        name: name.trim(),
        url: url.trim().replace(/\/+$/, ''),
        detail: typeof detail === 'string' && detail.trim() ? detail.trim() : undefined,
        isAdult: isAdult === true,
      };
    });
    return list;
  } catch (err) {
    console.warn('[LibreTV] DEFAULT_SOURCES 解析失败，已忽略：', err instanceof Error ? err.message : err);
    return [];
  }
}
