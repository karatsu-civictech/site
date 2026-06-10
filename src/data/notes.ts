// note.com(シビックテック唐津)の RSS から最新記事を取得する。
// Astro のビルド時に実行されるため、記事の反映にはサイトの再ビルドが必要
// （deploy.yml の schedule で毎日自動再ビルドしている）。

export const NOTE_URL = 'https://note.com/civic_t_karatsu';

export interface NoteArticle {
  title: string;
  url: string;
  /** 例: 2026年6月8日 */
  dateLabel: string;
  /** <time datetime> 用 ISO 文字列 */
  dateISO: string;
  /** 本文冒頭の抜粋（HTML タグ除去済み） */
  excerpt: string;
}

/** <item> ブロックから指定タグの中身を取り出す（CDATA 対応） */
function tagText(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!m) return '';
  return m[1].replace(/^\s*<!\[CDATA\[([\s\S]*)\]\]>\s*$/, '$1').trim();
}

export async function fetchNoteArticles(limit = 3): Promise<NoteArticle[]> {
  try {
    const res = await fetch(`${NOTE_URL}/rss`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

    return items.slice(0, limit).map((item) => {
      const date = new Date(tagText(item, 'pubDate'));
      const excerpt = tagText(item, 'description')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/続きをみる\s*$/, '')
        .trim();
      return {
        title: tagText(item, 'title'),
        url: tagText(item, 'link'),
        dateLabel: date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Tokyo',
        }),
        dateISO: date.toISOString(),
        excerpt: excerpt.length > 100 ? `${excerpt.slice(0, 100)}…` : excerpt,
      };
    });
  } catch (e) {
    // RSS が落ちていてもサイトのビルドは止めない
    console.warn('note RSS の取得に失敗しました:', e);
    return [];
  }
}
