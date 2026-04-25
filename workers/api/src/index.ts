/// <reference path="./types.d.ts" />

type PlatformName = 'tiktok' | 'meta';

type Env = {
  APP_NAME: string;
  OAUTH_STATE_KV: KVNamespace;
  OAUTH_SESSION_KV: KVNamespace;
  APP_LINKS_D1: D1Database;
  OAUTH_ENCRYPTION_SECRET?: string;
  APP_SESSION_SECRET?: string;
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
  token_type?: string;
  expires_in?: number;
  scope?: string;
  data?: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  };
  [key: string]: unknown;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });

const text = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });

const nowPlusSeconds = (seconds: number) => new Date(Date.now() + seconds * 1000).toISOString();

const randomId = () => crypto.randomUUID().replace(/-/g, '') + Math.random().toString(36).slice(2, 10);

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return new Uint8Array(digest);
};

const getKey = async (secret?: string) => {
  const fallback = secret ?? 'spgutils-default-secret';
  return crypto.subtle.importKey('raw', await sha256(fallback), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
};

const encryptValue = async (secret: string | undefined, value: string) => {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(value));
  const payload = new Uint8Array(iv.length + encrypted.byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...payload));
};

const baseUrlFor = (platform: PlatformName, env: Env) => {
  if (platform === 'tiktok') {
    return {
      clientId: env.TIKTOK_CLIENT_ID,
      clientSecret: env.TIKTOK_CLIENT_SECRET,
      authUrl: env.TIKTOK_AUTH_URL,
      tokenUrl: env.TIKTOK_TOKEN_URL,
      redirectUri: env.TIKTOK_REDIRECT_URI,
      scopes: env.TIKTOK_SCOPES ?? '',
      longLivedUrl: undefined
    };
  }

  return {
    clientId: env.META_APP_ID,
    clientSecret: env.META_APP_SECRET,
    authUrl: env.META_AUTH_URL,
    tokenUrl: env.META_TOKEN_URL,
    redirectUri: env.META_REDIRECT_URI,
    scopes: env.META_SCOPES ?? '',
    longLivedUrl: env.META_LONG_LIVED_TOKEN_URL
  };
};

const frontPath = (platform: PlatformName, step: 'login' | 'callback' | 'dashboard') => `/review/${platform}/${step}`;

const storeState = async (env: Env, platform: PlatformName, payload: Record<string, unknown>) => {
  const state = randomId();
  await env.OAUTH_STATE_KV.put(
    `state:${platform}:${state}`,
    JSON.stringify({ ...payload, platform, createdAt: new Date().toISOString() }),
    { expirationTtl: 900 }
  );
  return state;
};

const readState = async (env: Env, platform: PlatformName, state: string) => {
  const raw = await env.OAUTH_STATE_KV.get(`state:${platform}:${state}`);
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
};

const deleteState = async (env: Env, platform: PlatformName, state: string) => {
  await env.OAUTH_STATE_KV.delete(`state:${platform}:${state}`);
};

const postForm = async (url: string, form: URLSearchParams) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  });

const exchangeCode = async (platform: PlatformName, env: Env, code: string) => {
  const config = baseUrlFor(platform, env);
  if (!config.clientId || !config.clientSecret || !config.tokenUrl || !config.redirectUri) {
    throw new Error(`Missing OAuth configuration for ${platform}`);
  }

  const form = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code'
  });

  const response = await postForm(config.tokenUrl, form);
  const data = (await response.json()) as OAuthTokenResponse;

  if (!response.ok) {
    throw new Error(`Token exchange failed for ${platform}`);
  }

  if (platform === 'meta' && config.longLivedUrl && data.access_token) {
    const longForm = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      fb_exchange_token: data.access_token
    });

    const longResponse = await fetch(config.longLivedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: longForm.toString()
    });

    if (longResponse.ok) {
      const longData = (await longResponse.json()) as OAuthTokenResponse;
      return {
        access_token: longData.access_token ?? data.access_token ?? '',
        refresh_token: data.refresh_token,
        scope: longData.scope ?? data.scope,
        expires_in: longData.expires_in ?? data.expires_in
      };
    }
  }

  return {
    access_token: data.access_token ?? data.data?.access_token ?? '',
    refresh_token: data.refresh_token ?? data.data?.refresh_token,
    scope: data.scope ?? data.data?.scope,
    expires_in: data.expires_in ?? data.data?.expires_in
  };
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
    `INSERT INTO linked_accounts (
      platform, provider_user_id, display_name, scopes, access_token_enc, refresh_token_enc, expires_at, status, metadata_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  )
    .bind(
      platform,
      (metadata.provider_user_id as string | null | undefined) ?? null,
      (metadata.display_name as string | null | undefined) ?? null,
      token.scope ?? '',
      accessTokenEnc,
      refreshTokenEnc,
      expiresAt,
      'connected',
      JSON.stringify(metadata)
    )
    .run();
};

const writeEvent = async (
  env: Env,
  platform: PlatformName,
  eventType: string,
  success: boolean,
  stateKey: string | null,
  details: Record<string, unknown>
) => {
  await env.APP_LINKS_D1.prepare(
    `INSERT INTO oauth_events (platform, event_type, state_key, success, details_json) VALUES (?, ?, ?, ?, ?)`
  )
    .bind(platform, eventType, stateKey, success ? 1 : 0, JSON.stringify(details))
    .run();
};

const redirect = (location: string, status = 302) =>
  new Response(null, {
    status,
    headers: {
      Location: location,
      'Cache-Control': 'no-store'
    }
  });

const handleLogin = async (platform: PlatformName, request: Request, env: Env) => {
  const config = baseUrlFor(platform, env);
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('return_to') ?? frontPath(platform, 'dashboard');
  const state = await storeState(env, platform, { returnTo });

  if (!config.authUrl || !config.clientId || !config.redirectUri) {
    return text(`Missing OAuth configuration for ${platform}`, 500);
  }

  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', config.redirectUri);
  authUrl.searchParams.set('state', state);
  if (config.scopes) {
    authUrl.searchParams.set('scope', config.scopes);
  }

  await writeEvent(env, platform, 'login', true, state, { returnTo });
  return redirect(authUrl.toString());
};

const handleCallback = async (platform: PlatformName, request: Request, env: Env) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return text('Missing OAuth code or state.', 400);
  }

  const stateData = await readState(env, platform, state);
  if (!stateData) {
    await writeEvent(env, platform, 'callback', false, state, { reason: 'invalid_state' });
    return text('Invalid or expired OAuth state.', 400);
  }

  try {
    const token = await exchangeCode(platform, env, code);
    const metadata = {
      provider_user_id: url.searchParams.get('user_id'),
      display_name: url.searchParams.get('display_name')
    };

    await saveAccount(env, platform, token, metadata);
    await writeEvent(env, platform, 'callback', true, state, { ok: true, metadata });
    await deleteState(env, platform, state);

    const returnTo = typeof stateData.returnTo === 'string' ? stateData.returnTo : frontPath(platform, 'dashboard');
    return redirect(returnTo);
  } catch (error) {
    await writeEvent(env, platform, 'callback', false, state, {
      error: error instanceof Error ? error.message : 'unknown_error'
    });
    return text('OAuth callback failed.', 500);
  }
};

const handleStatus = async (platform: PlatformName, env: Env) => {
  const row = await env.APP_LINKS_D1.prepare(
    `SELECT platform, provider_user_id, display_name, scopes, expires_at, status, metadata_json, updated_at
     FROM linked_accounts WHERE platform = ? ORDER BY updated_at DESC LIMIT 1`
  )
    .bind(platform)
    .first<Record<string, unknown>>();

  return json({
    ok: true,
    platform,
    connected: Boolean(row),
    account: row
      ? {
          providerUserId: row.provider_user_id,
          displayName: row.display_name,
          scopes: row.scopes,
          expiresAt: row.expires_at,
          status: row.status,
          updatedAt: row.updated_at
        }
      : null
  });
};

const handleDeletion = async (request: Request, env: Env) => {
  if (request.method !== 'POST') {
    return json({
      ok: true,
      message: 'POST a platform and identifier to request deletion.'
    });
  }

  const contentType = request.headers.get('content-type') ?? '';
  let platform: string | null = null;
  let identifier: string | null = null;

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as Record<string, unknown>;
    platform = typeof body.platform === 'string' ? body.platform : null;
    identifier = typeof body.identifier === 'string' ? body.identifier : null;
  } else {
    const form = await request.formData();
    platform = typeof form.get('platform') === 'string' ? String(form.get('platform')) : null;
    identifier = typeof form.get('identifier') === 'string' ? String(form.get('identifier')) : null;
  }

  if (!platform || !identifier) {
    return json({ ok: false, error: 'missing platform or identifier' }, 400);
  }

  await env.APP_LINKS_D1.prepare(
    `DELETE FROM linked_accounts WHERE platform = ? AND (provider_user_id = ? OR display_name = ?)`
  )
    .bind(platform, identifier, identifier)
    .run();

  await env.APP_LINKS_D1.prepare(
    `INSERT INTO oauth_events (platform, event_type, success, details_json) VALUES (?, 'data_deletion', 1, ?)`
  )
    .bind(platform, JSON.stringify({ identifier }))
    .run();

  return json({ ok: true, message: 'Deletion request accepted.' });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/api/health') {
      return json({ ok: true, app: env.APP_NAME, time: new Date().toISOString() });
    }

    if (pathname === '/api/tiktok/login') {
      return handleLogin('tiktok', request, env);
    }
    if (pathname === '/api/tiktok/callback') {
      return handleCallback('tiktok', request, env);
    }
    if (pathname === '/api/tiktok/status') {
      return handleStatus('tiktok', env);
    }

    if (pathname === '/api/meta/login') {
      return handleLogin('meta', request, env);
    }
    if (pathname === '/api/meta/callback') {
      return handleCallback('meta', request, env);
    }
    if (pathname === '/api/meta/status') {
      return handleStatus('meta', env);
    }

    if (pathname === '/api/data-deletion') {
      return handleDeletion(request, env);
    }

    return text('Not found', 404);
  }
};
