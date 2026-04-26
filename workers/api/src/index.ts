/// <reference path="./types.d.ts" />

type PlatformName = 'tiktok' | 'meta';
type Env = {
  APP_NAME: string;
  BASE_URL?: string;
  FRONTEND_URL?: string;
  BOT_USERNAME?: string;
  BOT_API_KEY?: string;
  OAUTH_STATE_KV: KVNamespace;
  OAUTH_SESSION_KV: KVNamespace;
  APP_LINKS_D1: D1Database;
  OAUTH_ENCRYPTION_SECRET?: string;
  APP_SESSION_SECRET?: string;
  TIKTOK_CLIENT_KEY?: string;
  TIKTOK_CLIENT_ID?: string;
  TIKTOK_CLIENT_SECRET?: string;
  TIKTOK_AUTH_URL?: string;
  TIKTOK_TOKEN_URL?: string;
  TIKTOK_SCOPES?: string;
  TIKTOK_REDIRECT_URI?: string;
  META_APP_ID?: string;
  META_APP_SECRET?: string;
  META_AUTH_URL?: string;
  META_TOKEN_URL?: string;
  META_LONG_LIVED_TOKEN_URL?: string;
  META_SCOPES?: string;
  META_REDIRECT_URI?: string;
  SUPPORT_EMAIL?: string;
};
type OAuthTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  data?: { access_token?: string; refresh_token?: string; expires_in?: number; scope?: string };
  [key: string]: unknown;
};
type LinkedAccountRow = {
  id: number;
  platform: string;
  provider_user_id: string | null;
  display_name: string | null;
  scopes: string;
  access_token_enc: string;
  refresh_token_enc: string | null;
  expires_at: string | null;
  status: string;
  metadata_json: string | null;
  created_at: string;
  updated_at: string;
};
type MetaDebugTokenResponse = { data?: { is_valid?: boolean; granular_scopes?: Array<{ scope?: string; target_ids?: string[] }> } };
type MetaPageResponse = { id?: string; name?: string; access_token?: string; instagram_business_account?: { id?: string; username?: string; name?: string; profile_picture_url?: string }; [key: string]: unknown };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const text = (body: string, status = 200) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
const errorJson = (message: string, status = 500, details?: Record<string, unknown>) => json({ ok: false, error: message, ...(details ? { details } : {}) }, status);
const redirect = (location: string, status = 302) => new Response(null, { status, headers: { Location: location, 'Cache-Control': 'no-store' } });
const nowPlusSeconds = (seconds: number) => new Date(Date.now() + seconds * 1000).toISOString();
const randomId = () => crypto.randomUUID().replace(/-/g, '') + Math.random().toString(36).slice(2, 10);
const graphBaseUrl = 'https://graph.facebook.com/v25.0';

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return new Uint8Array(digest);
};
const getKey = async (secret?: string) => crypto.subtle.importKey('raw', await sha256(secret ?? 'spgutils-default-secret'), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
const encryptValue = async (secret: string | undefined, value: string) => {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(value));
  const payload = new Uint8Array(iv.length + encrypted.byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...payload));
};
const decryptValue = async (secret: string | undefined, value: string) => {
  const key = await getKey(secret);
  const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, key, bytes.slice(12));
  return new TextDecoder().decode(decrypted);
};
const parseJsonOrForm = async (request: Request) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return (await request.json()) as Record<string, unknown>;
  const form = await request.formData();
  const result: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) result[key] = value;
  return result;
};
const postForm = async (url: string, form: URLSearchParams) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form.toString() });
const graphGet = async (path: string, accessToken: string, params: Record<string, string | number | undefined> = {}) => {
  const url = new URL(`${graphBaseUrl}${path}`);
  url.searchParams.set('access_token', accessToken);
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Graph API request failed for ${path}`);
  return data as Record<string, unknown>;
};
const requireBotAuth = (request: Request, env: Env) => {
  if (!env.BOT_API_KEY) return false;
  const header = request.headers.get('Authorization') ?? request.headers.get('authorization') ?? '';
  return header === `Bearer ${env.BOT_API_KEY}`;
};
const getBaseUrl = (env: Env) => env.BASE_URL ?? 'https://api.spgutils.ru';
const getFrontendUrl = (env: Env) => env.FRONTEND_URL ?? 'https://spgutils.ru';
const getBotUsername = (env: Env) => env.BOT_USERNAME ?? 'autoposter_spg_bot';
const getTelegramBotUrl = (env: Env, linkToken?: string | null) => {
  const username = getBotUsername(env);
  return linkToken ? `https://t.me/${username}?start=oauth_done_${encodeURIComponent(linkToken)}` : `https://t.me/${username}`;
};
const getPlatformConfig = (platform: PlatformName, env: Env) => {
  if (platform === 'tiktok') return { clientId: env.TIKTOK_CLIENT_KEY ?? env.TIKTOK_CLIENT_ID, clientSecret: env.TIKTOK_CLIENT_SECRET, authUrl: env.TIKTOK_AUTH_URL ?? 'https://open-api.tiktok.com/platform/oauth/connect/', tokenUrl: env.TIKTOK_TOKEN_URL ?? 'https://open-api.tiktok.com/oauth/access_token/', redirectUri: env.TIKTOK_REDIRECT_URI ?? `${getBaseUrl(env)}/api/oauth/tiktok/callback`, scopes: env.TIKTOK_SCOPES ?? 'user.info.basic,video.publish,video.upload' };
  return { clientId: env.META_APP_ID, clientSecret: env.META_APP_SECRET, authUrl: env.META_AUTH_URL ?? 'https://www.facebook.com/v25.0/dialog/oauth', tokenUrl: env.META_TOKEN_URL ?? 'https://graph.facebook.com/v25.0/oauth/access_token', longLivedUrl: env.META_LONG_LIVED_TOKEN_URL ?? 'https://graph.facebook.com/v25.0/oauth/access_token', redirectUri: env.META_REDIRECT_URI ?? `${getBaseUrl(env)}/api/oauth/meta/callback`, scopes: env.META_SCOPES ?? 'pages_show_list,pages_read_engagement,pages_manage_posts,business_management,instagram_basic,instagram_content_publish' };
};
const storeState = async (env: Env, platform: PlatformName, payload: Record<string, unknown>) => {
  const state = randomId();
  await env.OAUTH_STATE_KV.put(`state:${platform}:${state}`, JSON.stringify({ ...payload, platform, createdAt: new Date().toISOString() }), { expirationTtl: 900 });
  return state;
};
const readState = async (env: Env, platform: PlatformName, state: string) => {
  const raw = await env.OAUTH_STATE_KV.get(`state:${platform}:${state}`);
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
};
const deleteState = async (env: Env, platform: PlatformName, state: string) => { await env.OAUTH_STATE_KV.delete(`state:${platform}:${state}`); };
const readConnection = async (env: Env, id: number) =>
  env.APP_LINKS_D1.prepare(`SELECT id, platform, provider_user_id, display_name, scopes, access_token_enc, refresh_token_enc, expires_at, status, metadata_json, created_at, updated_at FROM linked_accounts WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<LinkedAccountRow>();
const readConnectionMetadata = (row: LinkedAccountRow | null) => {
  if (!row?.metadata_json) return null;
  try { return JSON.parse(row.metadata_json) as Record<string, unknown>; } catch { return null; }
};
const getConnectionWithSecret = async (env: Env, id: number) => {
  const row = await readConnection(env, id);
  if (!row) return null;
  return { ...row, accessToken: await decryptValue(env.OAUTH_ENCRYPTION_SECRET, row.access_token_enc), refreshToken: row.refresh_token_enc ? await decryptValue(env.OAUTH_ENCRYPTION_SECRET, row.refresh_token_enc) : null, metadata: readConnectionMetadata(row) };
};
const getConnectionByLinkToken = async (env: Env, linkToken: string) => {
  const rows = await env.APP_LINKS_D1.prepare(`SELECT id, platform, provider_user_id, display_name, scopes, access_token_enc, refresh_token_enc, expires_at, status, metadata_json, created_at, updated_at FROM linked_accounts WHERE metadata_json LIKE ? ORDER BY updated_at DESC LIMIT 1`).bind(`%"link_token":"${linkToken}"%`).all<LinkedAccountRow>();
  return rows.results?.[0] ?? null;
};
const getConnectionByTelegramUserId = async (env: Env, telegramUserId: string) => {
  const rows = await env.APP_LINKS_D1.prepare(`SELECT id, platform, provider_user_id, display_name, scopes, access_token_enc, refresh_token_enc, expires_at, status, metadata_json, created_at, updated_at FROM linked_accounts WHERE metadata_json LIKE ? ORDER BY updated_at DESC LIMIT 50`).bind(`%"telegram_user_id":"${telegramUserId}"%`).all<LinkedAccountRow>();
  return rows.results ?? [];
};
const buildAccountSummary = (row: LinkedAccountRow) => {
  const metadata = readConnectionMetadata(row);
  return { id: row.id, platform: row.platform, provider_user_id: row.provider_user_id, display_name: row.display_name, scopes: row.scopes, expires_at: row.expires_at, status: row.status, telegram_user_id: typeof metadata?.telegram_user_id === 'string' ? metadata.telegram_user_id : null, link_token: typeof metadata?.link_token === 'string' ? metadata.link_token : null, created_at: row.created_at, updated_at: row.updated_at };
};

const saveAccount = async (
  env: Env,
  platform: PlatformName,
  token: { access_token: string; refresh_token?: string; scope?: string; expires_in?: number },
  metadata: Record<string, unknown>
) => {
  const expiresAt = token.expires_in ? nowPlusSeconds(token.expires_in) : null;
  const accessTokenEnc = await encryptValue(env.OAUTH_ENCRYPTION_SECRET, token.access_token);
  const refreshTokenEnc = token.refresh_token ? await encryptValue(env.OAUTH_ENCRYPTION_SECRET, token.refresh_token) : null;
  await env.APP_LINKS_D1.prepare(
    `INSERT INTO linked_accounts (platform, provider_user_id, display_name, scopes, access_token_enc, refresh_token_enc, expires_at, status, metadata_json, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  )
    .bind(platform, (metadata.provider_user_id as string | null | undefined) ?? null, (metadata.display_name as string | null | undefined) ?? null, token.scope ?? '', accessTokenEnc, refreshTokenEnc, expiresAt, 'connected', JSON.stringify(metadata))
    .run();
};
const writeEvent = async (env: Env, platform: PlatformName, eventType: string, success: boolean, stateKey: string | null, details: Record<string, unknown>) => {
  await env.APP_LINKS_D1.prepare(`INSERT INTO oauth_events (platform, event_type, state_key, success, details_json) VALUES (?, ?, ?, ?, ?)`)
    .bind(platform, eventType, stateKey, success ? 1 : 0, JSON.stringify(details))
    .run();
};
const exchangeCode = async (platform: PlatformName, env: Env, code: string) => {
  const config = getPlatformConfig(platform, env);
  if (!config.clientId || !config.clientSecret || !config.tokenUrl || !config.redirectUri) throw new Error(`Missing OAuth configuration for ${platform}`);
  const form = new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, code, redirect_uri: config.redirectUri, grant_type: 'authorization_code' });
  const response = await postForm(config.tokenUrl, form);
  const data = (await response.json()) as OAuthTokenResponse;
  if (!response.ok) throw new Error(`Token exchange failed for ${platform}`);
  if (platform === 'meta' && config.longLivedUrl && data.access_token) {
    const longForm = new URLSearchParams({ grant_type: 'fb_exchange_token', client_id: config.clientId, client_secret: config.clientSecret, fb_exchange_token: data.access_token });
    const longResponse = await postForm(config.longLivedUrl, longForm);
    if (longResponse.ok) {
      const longData = (await longResponse.json()) as OAuthTokenResponse;
      return { access_token: longData.access_token ?? data.access_token ?? '', refresh_token: data.refresh_token, scope: longData.scope ?? data.scope, expires_in: longData.expires_in ?? data.expires_in };
    }
  }
  return { access_token: data.access_token ?? data.data?.access_token ?? '', refresh_token: data.refresh_token ?? data.data?.refresh_token, scope: data.scope ?? data.data?.scope, expires_in: data.expires_in ?? data.data?.expires_in };
};
const getMetaTargetPageIdsFromDebugToken = (debugResponse: MetaDebugTokenResponse) => {
  const targetIds = new Set<string>();
  for (const scope of debugResponse.data?.granular_scopes ?? []) for (const targetId of scope.target_ids ?? []) if (targetId) targetIds.add(String(targetId));
  return [...targetIds];
};
const fetchMetaPageById = async (pageId: string, accessToken: string) => (await graphGet(`/${pageId}`, accessToken, { fields: 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}' })) as MetaPageResponse;
const getMetaContext = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const connectionId = Number(url.searchParams.get('connection_id'));
  if (!Number.isFinite(connectionId) || connectionId <= 0) return { error: errorJson('missing or invalid connection_id', 400) as Response };
  if (!env.META_APP_ID || !env.META_APP_SECRET) return { error: errorJson('Missing Meta app configuration', 500) as Response };
  const connection = await getConnectionWithSecret(env, connectionId);
  if (!connection || connection.platform !== 'meta') return { error: errorJson('connection not found', 404) as Response };
  return { connectionId, connection };
};
const resolveLinkRequest = async (env: Env, linkToken: string) => {
  const raw = await env.OAUTH_SESSION_KV.get(`link:${linkToken}`);
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
};
const storeLinkRequest = async (env: Env, payload: Record<string, unknown>) => {
  const linkToken = randomId();
  await env.OAUTH_SESSION_KV.put(`link:${linkToken}`, JSON.stringify({ ...payload, linkToken, createdAt: new Date().toISOString() }), { expirationTtl: 3600 });
  return linkToken;
};
const buildOAuthStart = async (platform: PlatformName, request: Request, env: Env) => {
  const config = getPlatformConfig(platform, env);
  if (!config.authUrl || !config.clientId || !config.redirectUri) return text(`Missing OAuth configuration for ${platform}`, 500);
  const url = new URL(request.url);
  const linkToken = url.searchParams.get('link_token');
  const returnTo = url.searchParams.get('return_to') ?? `${getFrontendUrl(env)}/review?${platform}=success`;
  const linkRequest = linkToken ? await resolveLinkRequest(env, linkToken) : null;
  const state = await storeState(env, platform, {
    returnTo,
    linkToken,
    telegramUserId: typeof linkRequest?.telegram_user_id === 'string' ? linkRequest.telegram_user_id : url.searchParams.get('telegram_user_id'),
    provider: typeof linkRequest?.provider === 'string' ? linkRequest.provider : platform
  });
  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', config.redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', config.scopes);
  if (linkToken) authUrl.searchParams.set('link_token', linkToken);
  await writeEvent(env, platform, 'start', true, state, { linkToken: linkToken ?? null, returnTo });
  return redirect(authUrl.toString());
};
const finishOAuth = async (platform: PlatformName, request: Request, env: Env) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) return text('Missing OAuth code or state.', 400);
  const stateData = await readState(env, platform, state);
  if (!stateData) {
    await writeEvent(env, platform, 'callback', false, state, { reason: 'invalid_state' });
    return text('Invalid or expired OAuth state.', 400);
  }
  try {
    const token = await exchangeCode(platform, env, code);
    let providerUserId: string | null = null;
    let displayName: string | null = null;
    if (platform === 'meta') {
      const me = await graphGet('/me', token.access_token, { fields: 'id,name' });
      providerUserId = typeof me.id === 'string' ? me.id : null;
      displayName = typeof me.name === 'string' ? me.name : null;
    }
    const metadata = {
      provider_user_id: providerUserId,
      display_name: displayName,
      telegram_user_id: typeof stateData.telegramUserId === 'string' ? stateData.telegramUserId : null,
      link_token: typeof stateData.linkToken === 'string' ? stateData.linkToken : null,
      source: typeof stateData.linkToken === 'string' ? 'telegram_bot' : 'review_site'
    };
    await saveAccount(env, platform, token, metadata);
    await writeEvent(env, platform, 'callback', true, state, { ok: true, metadata });
    await deleteState(env, platform, state);
    const linkToken = typeof stateData.linkToken === 'string' ? stateData.linkToken : null;
    return redirect(linkToken ? getTelegramBotUrl(env, linkToken) : (typeof stateData.returnTo === 'string' ? stateData.returnTo : `${getFrontendUrl(env)}/review?${platform}=success`));
  } catch (error) {
    await writeEvent(env, platform, 'callback', false, state, { error: error instanceof Error ? error.message : 'unknown_error' });
    return text('OAuth callback failed.', 500);
  }
};

const listConnections = async (request: Request, env: Env) => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform');
  const telegramUserId = url.searchParams.get('telegram_user_id');
  const where: string[] = [];
  const values: string[] = [];
  if (platform) {
    where.push('platform = ?');
    values.push(platform);
  }
  if (telegramUserId) {
    where.push('metadata_json LIKE ?');
    values.push(`%"telegram_user_id":"${telegramUserId}"%`);
  }
  const query = `SELECT id, platform, provider_user_id, display_name, scopes, access_token_enc, refresh_token_enc, expires_at, status, metadata_json, created_at, updated_at FROM linked_accounts${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY updated_at DESC LIMIT 100`;
  const result = await env.APP_LINKS_D1.prepare(query).bind(...values).all<LinkedAccountRow>();
  return json({ ok: true, count: result.results?.length ?? 0, connections: (result.results ?? []).map(buildAccountSummary) });
};

const connectionStatus = async (request: Request, env: Env) => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  const url = new URL(request.url);
  const connectionId = Number(url.searchParams.get('connection_id'));
  const linkToken = url.searchParams.get('link_token');
  const telegramUserId = url.searchParams.get('telegram_user_id');
  if (Number.isFinite(connectionId) && connectionId > 0) {
    const row = await readConnection(env, connectionId);
    return json({ ok: true, connection_id: connectionId, connection: row ? buildAccountSummary(row) : null });
  }
  if (linkToken) {
    const row = await getConnectionByLinkToken(env, linkToken);
    return json({ ok: true, link_token: linkToken, connection: row ? buildAccountSummary(row) : null });
  }
  if (telegramUserId) {
    const rows = await getConnectionByTelegramUserId(env, telegramUserId);
    return json({ ok: true, telegram_user_id: telegramUserId, connections: rows.map(buildAccountSummary) });
  }
  return errorJson('missing connection_id, link_token, or telegram_user_id', 400);
};

const connectionToken = async (request: Request, env: Env) => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  const url = new URL(request.url);
  const connectionId = Number(url.searchParams.get('connection_id'));
  const linkToken = url.searchParams.get('link_token');
  let row: LinkedAccountRow | null = null;
  if (Number.isFinite(connectionId) && connectionId > 0) row = await readConnection(env, connectionId);
  else if (linkToken) row = await getConnectionByLinkToken(env, linkToken);
  if (!row) return errorJson('connection not found', 404);
  if (row.status !== 'connected') return errorJson('connection is not active', 409);
  const accessToken = await decryptValue(env.OAUTH_ENCRYPTION_SECRET, row.access_token_enc);
  const refreshToken = row.refresh_token_enc ? await decryptValue(env.OAUTH_ENCRYPTION_SECRET, row.refresh_token_enc) : null;
  return json({ ok: true, connection_id: row.id, platform: row.platform, access_token: accessToken, refresh_token: refreshToken, expires_at: row.expires_at });
};

const revokeConnection = async (request: Request, env: Env) => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  try {
    const body = await parseJsonOrForm(request);
    const connectionId = Number(body.connection_id ?? body.id);
    const linkToken = typeof body.link_token === 'string' ? body.link_token : null;
    let row: LinkedAccountRow | null = null;
    if (Number.isFinite(connectionId) && connectionId > 0) row = await readConnection(env, connectionId);
    else if (linkToken) row = await getConnectionByLinkToken(env, linkToken);
    if (!row) return errorJson('connection not found', 404);
    const metadata = readConnectionMetadata(row) ?? {};
    metadata.revoked_at = new Date().toISOString();
    metadata.revoked_by = 'bot';
    await env.APP_LINKS_D1.prepare(`UPDATE linked_accounts SET status = 'revoked', access_token_enc = ?, refresh_token_enc = NULL, metadata_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .bind(await encryptValue(env.OAUTH_ENCRYPTION_SECRET, 'revoked'), JSON.stringify(metadata), row.id)
      .run();
    return json({ ok: true, connection_id: row.id, status: 'revoked' });
  } catch (error) {
    return errorJson('failed to revoke connection', 500, { reason: error instanceof Error ? error.message : 'unknown_error' });
  }
};

const metaAccounts = async (request: Request, env: Env): Promise<Response> => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  try {
    const context = await getMetaContext(request, env);
    if ('error' in context && context.error) return context.error;
    const { connectionId, connection } = context;
    const primary = await graphGet('/me/accounts', connection.accessToken, { fields: 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}' });
    const pages = Array.isArray(primary.data) ? primary.data : [];
    if (pages.length > 0) return json({ ok: true, connection_id: connectionId, pages, source: 'me_accounts' });
    const debug = (await graphGet('/debug_token', `${env.META_APP_ID}|${env.META_APP_SECRET}`, { input_token: connection.accessToken })) as MetaDebugTokenResponse;
    const fallbackPages: MetaPageResponse[] = [];
    for (const pageId of getMetaTargetPageIdsFromDebugToken(debug)) {
      try {
        const page = await fetchMetaPageById(pageId, connection.accessToken);
        if (page?.id) fallbackPages.push(page);
      } catch {}
    }
    return json({ ok: true, connection_id: connectionId, pages: fallbackPages, source: 'debug_token_target_ids' });
  } catch (error) {
    return errorJson('Failed to load Meta pages.', 500, { reason: error instanceof Error ? error.message : 'unknown_error' });
  }
};

const metaDebug = async (request: Request, env: Env): Promise<Response> => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  try {
    const context = await getMetaContext(request, env);
    if ('error' in context && context.error) return context.error;
    const { connectionId, connection } = context;
    const debug = await graphGet('/debug_token', `${env.META_APP_ID}|${env.META_APP_SECRET}`, { input_token: connection.accessToken });
    return json({ ok: true, connection_id: connectionId, debug });
  } catch (error) {
    return errorJson('Failed to load Meta debug data.', 500, { reason: error instanceof Error ? error.message : 'unknown_error' });
  }
};

const metaPage = async (request: Request, env: Env): Promise<Response> => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  try {
    const context = await getMetaContext(request, env);
    if ('error' in context && context.error) return context.error;
    const { connectionId, connection } = context;
    const url = new URL(request.url);
    const pageId = url.searchParams.get('id') ?? url.searchParams.get('page_id');
    if (!pageId) return errorJson('missing page id', 400);
    const page = await fetchMetaPageById(pageId, connection.accessToken);
    return json({ ok: true, connection_id: connectionId, page, source: 'page_by_id' });
  } catch (error) {
    return errorJson('Failed to load Meta page.', 500, { reason: error instanceof Error ? error.message : 'unknown_error' });
  }
};

const linkStart = async (request: Request, env: Env) => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  try {
    const body = request.method === 'POST' ? await parseJsonOrForm(request) : Object.fromEntries(new URL(request.url).searchParams.entries());
    const telegramUserId = typeof body.telegram_user_id === 'string' ? body.telegram_user_id : null;
    const provider = body.provider === 'meta' ? 'meta' : body.provider === 'tiktok' ? 'tiktok' : null;
    if (!telegramUserId || !provider) return errorJson('missing telegram_user_id or provider', 400);
    const linkToken = await storeLinkRequest(env, { telegram_user_id: telegramUserId, provider });
    return json({ ok: true, link_token: linkToken, provider, telegram_user_id: telegramUserId, expires_in: 3600 });
  } catch (error) {
    return errorJson('failed to create link token', 500, { reason: error instanceof Error ? error.message : 'unknown_error' });
  }
};

const linkResult = async (request: Request, env: Env) => {
  if (!requireBotAuth(request, env)) return errorJson('unauthorized', 401);
  try {
    const url = new URL(request.url);
    const linkToken = url.searchParams.get('link_token');
    if (!linkToken) return errorJson('missing link_token', 400);
    const linkRequest = await resolveLinkRequest(env, linkToken);
    if (!linkRequest) return json({ ok: true, link_token: linkToken, status: 'expired_or_missing', connection: null });
    const row = await getConnectionByLinkToken(env, linkToken);
    return json({ ok: true, link_token: linkToken, status: row ? row.status : 'pending', link_request: linkRequest, connection: row ? buildAccountSummary(row) : null });
  } catch (error) {
    return errorJson('failed to load link result', 500, { reason: error instanceof Error ? error.message : 'unknown_error' });
  }
};

const handleDeletion = async (request: Request) => {
  if (request.method !== 'POST') {
    return json({ ok: true, message: 'POST a platform and identifier to request deletion.' });
  }
  const body = await parseJsonOrForm(request);
  const platform = typeof body.platform === 'string' ? body.platform : null;
  const identifier = typeof body.identifier === 'string' ? body.identifier : null;
  if (!platform || !identifier) return json({ ok: false, error: 'missing platform or identifier' }, 400);
  return json({ ok: true, message: 'Deletion request accepted.', platform, identifier });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const pathname = new URL(request.url).pathname;
    if (pathname === '/api/health') return json({ ok: true, app: env.APP_NAME, time: new Date().toISOString() });
    if (pathname === '/api/link/start') return linkStart(request, env);
    if (pathname === '/api/link/result') return linkResult(request, env);
    if (pathname === '/api/oauth/tiktok/start') return buildOAuthStart('tiktok', request, env);
    if (pathname === '/api/oauth/tiktok/callback') return finishOAuth('tiktok', request, env);
    if (pathname === '/api/oauth/meta/start') return buildOAuthStart('meta', request, env);
    if (pathname === '/api/oauth/meta/callback') return finishOAuth('meta', request, env);
    if (pathname === '/api/connections/status') return connectionStatus(request, env);
    if (pathname === '/api/connections/list') return listConnections(request, env);
    if (pathname === '/api/connections/token') return connectionToken(request, env);
    if (pathname === '/api/connections/revoke') return revokeConnection(request, env);
    if (pathname === '/api/meta/accounts') return metaAccounts(request, env);
    if (pathname === '/api/meta/page') return metaPage(request, env);
    if (pathname === '/api/meta/debug') return metaDebug(request, env);
    if (pathname === '/api/data-deletion') return handleDeletion(request);
    return text('Not found', 404);
  }
};
