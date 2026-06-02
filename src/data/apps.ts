// シビックテック唐津が公開する Web アプリ（データツール）の一覧。
//
// 新しいアプリを追加するときは、この配列に 1 件足すだけ。
//   1. ここに { path, title, ... } を追記
//   2. アプリ本体は別リポジトリ（karatsu-civictech/<repo>）で開発
//   3. vercel.json の rewrites に /<path> の転送先を 1 行足す
// これでトップの「アプリ一覧」に自動で並びます。

export type AppStatus = 'live' | 'wip' | 'planned';

export interface CivicApp {
  /** アクセスパス（先頭スラッシュなし）。例: 'gikai' → karatsu-civictech.org/gikai */
  path: string;
  /** 表示名 */
  title: string;
  /** 1〜2 文の説明 */
  description: string;
  /** 公開状況 */
  status: AppStatus;
  /** GitHub リポジトリ名（karatsu-civictech/<repo>）。未作成なら省略可 */
  repo?: string;
  /** カードに添えるアイコン（絵文字でOK） */
  icon?: string;
}

export const STATUS_LABEL: Record<AppStatus, string> = {
  live: '公開中',
  wip: '開発中',
  planned: '構想中',
};

export const apps: CivicApp[] = [
  {
    path: 'gikai',
    title: '唐津の議員見える化プロジェクト',
    description:
      '唐津市議会の会議録から、議員ごとの発言をワードクラウドで可視化。各議員が議会で「どんなテーマを多く語っているか」が一目で分かります。',
    status: 'live',
    repo: 'gikai',
    icon: '🗳️',
  },
  {
    path: 'bousai',
    title: '防災マップ（仮）',
    description:
      'ハザード情報や避難所などのオープンデータを地図上に重ねて、地域の防災を「自分ごと」にするためのマップアプリ。',
    status: 'planned',
    repo: 'bousai-map',
    icon: '🗺️',
  },
];
