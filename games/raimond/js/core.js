
// ==================== CORE: canvas, input, helpers, audio ====================
const W = 320, H = 180, VW = 640, VH = 360, T = 16;
let U = 4;
const C = document.getElementById('c'), X = C.getContext('2d');

function resize() {
    const d = window.devicePixelRatio || 1, m = Math.min(innerWidth * d / W, innerHeight * d / H);
    U = Math.max(2, 2 * Math.floor(m / 2));
    C.width = W * U; C.height = H * U;
    C.style.width = C.width / d + 'px'; C.style.height = C.height / d + 'px';
    X.imageSmoothingEnabled = false;
}

addEventListener('resize', resize); resize();

const sU = () => X.setTransform(U, 0, 0, U, 0, 0);
const sW = () => X.setTransform(U / 2, 0, 0, U / 2, 0, 0);

const ST = {
    get(k) {
        try { return localStorage.getItem(k) }
        catch (e) { return null }
    },
    set(k, v) {
        try { localStorage.setItem(k, v) } catch (e) { }
        try {
            document.cookie = k.replace(/\W/g, '_') + '=1;max-age=31536000;path=/'
        } catch (e) { }
    }
};


// ==================== SUPABASE CONFIGURATION ====================

const SUPABASE_URL = "https://mloytoysisbazergxhnh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_kZRJM0sUZPLSnOP5rzWEFQ_OnGPPSFO";

// Timeout for Supabase Auth HTTP requests.
function authTimeoutFetch(input, init = {}) {
    const url = typeof input === "string" ? input : input.url;

    if (!url.includes("/auth/v1/")) {
        return fetch(input, init);
    }

    const timeoutSignal = AbortSignal.timeout(10000);
    const inputSignal = input instanceof Request ? input.signal : null;
    const signals = [timeoutSignal, init.signal, inputSignal].filter(Boolean);

    return fetch(input, {
        ...init,
        signal: AbortSignal.any(signals)
    });
}

// If the Supabase script didn't load (offline, blocked, or a page that leaves it out on purpose such as
// part_two_test.html), authClient is null: the game runs normally and telemetry is skipped.
const authClient = typeof supabase !== 'undefined' ? supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    { global: { fetch: authTimeoutFetch } }
) : null;

// ==================== ANONYMOUS AUTHENTICATION ====================

async function ensureAnonymousAuth() {
    if (!authClient) return;
    try {
        const { data, error } = await authClient.auth.getSession();

        if (error) {
            console.warn("Authentication error:", error);
            return null;
        }

        if (data.session) {
            return data.session;
        }

        const { data: signInData, error: signInError } =
            await authClient.auth.signInAnonymously();

        if (signInError) {
            console.warn("Unsuccessful sign-in:", signInError);
            return null;
        }

        if (signInData.session) {
            return signInData.session;
        }

        return null;
    } catch (error) {
        console.warn("Anonymous authentication failed:", error);
        return null;
    }
}

// ==================== PLAY SESSION CREATION ====================
function getPlayerName() {
    try {
        const savedName = localStorage.getItem("syn_player_name");

        if (savedName !== null) {
            return savedName;
        }

        const enteredName = window.prompt(
            "What should we call you? (Optional)"
        );

        const playerName = (enteredName ?? "").trim().slice(0, 40);

        localStorage.setItem("syn_player_name", playerName);

        return playerName;
    } catch (error) {
        console.warn("Unable to save player name:", error);
        return "";
    }
}


async function startSession() {
    if (!authClient) return;
    if (pageIsClosing) return null;

    try {
        const session = await ensureAnonymousAuth();

        if (session === null || pageIsClosing) {
            return null;
        }

        sessionCloseAccessToken = session.access_token;

        const response = await fetch(
            SUPABASE_URL + "/functions/v1/start-session",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: SUPABASE_PUBLISHABLE_KEY,
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    playerName: getPlayerName()
                }),
                signal: AbortSignal.timeout(10000)
            }
        );


        if (!response.ok) {
            let errorCode = null;

            try {
                const errorBody = await response.json();
                errorCode = errorBody?.code ?? null;
            } catch {
                // Some errors may not return JSON.
            }

            if (errorCode === "AUTH_ACCOUNT_MISSING") {
                console.warn(
                    "Saved authentication account was deleted. Resetting login."
                );

                const { error: signOutError } =
                    await authClient.auth.signOut({
                        scope: "local"
                    });

                if (signOutError) {
                    console.warn(
                        "Authentication reset failed:",
                        signOutError
                    );
                }

                sessionCloseAccessToken = null;
                return null;
            }

            if (errorCode === "ACCOUNT_DELETING") {
                console.warn(
                    "This account is being deleted. New sessions are blocked."
                );

                return null;
            }

            console.warn(
                "Session creation failed:",
                response.status,
                errorCode
            );

            return null;
        }


        const data = await response.json();

        if (typeof data.sessionId !== "string") {
            console.warn("Invalid session ID received");
            return null;
        }

        // Close a newly created session if the page began closing.
        if (pageIsClosing) {
            sendSessionCloseRequest(data.sessionId);
            return null;
        }

        activeSessionId = data.sessionId;
        sessionStateVersion = 0;

        return data.sessionId;
    } catch (error) {
        console.warn("Unable to start session:", error);
        return null;
    }
}

// ==================== SESSION STARTUP RETRIES ====================

let sessionStartupInProgress = false;
let sessionStartupRetryTimer = null;

async function ensureGameSessionStarted() {
    if (!authClient) return;
    if (pageIsClosing) return;
    if (activeSessionId !== null) return;
    if (sessionRecoveryPending === true) return;
    if (sessionStartupInProgress === true) return;

    if (navigator.onLine === false) {
        scheduleSessionStartupRetry();
        return;
    }

    sessionStartupInProgress = true;

    try {
        const sessionId = await startSession();

        if (sessionId !== null) {
            console.info("Play session started:", sessionId);

            sessionNeedsResync = true;
            sessionIsPaused = false;
            desiredSessionPaused = document.hidden;

            setSessionPaused(document.hidden);
        } else {
            scheduleSessionStartupRetry();
        }
    } catch (error) {
        console.warn("Session startup failed:", error);
        scheduleSessionStartupRetry();
    } finally {
        sessionStartupInProgress = false;
    }
}

function scheduleSessionStartupRetry() {
    if (pageIsClosing) return;
    if (sessionStartupRetryTimer !== null) return;
    if (activeSessionId !== null) return;

    sessionStartupRetryTimer = setTimeout(() => {
        sessionStartupRetryTimer = null;
        ensureGameSessionStarted();
    }, 5000);
}

// ==================== SESSION STATE ====================

let activeSessionId = null;
let heartbeatInProgress = false;
let sessionIsPaused = false;
let pauseRequestInProgress = false;
let desiredSessionPaused = false;
let sessionNeedsResync = false;
let sessionResyncVersion = 0;
let sessionStateVersion = 0;
let pauseRetryTimer = null;
let sessionCloseAccessToken = null;
let sessionRecoveryPending = false;
let sessionRecoveryInProgress = false;
let pageIsClosing = false;

const PAUSE_RETRY_DELAY_MS = 5000;
const SESSION_REQUEST_TIMEOUT_MS = 10000;

if (authClient) authClient.auth.onAuthStateChange((_event, session) => {
    sessionCloseAccessToken = session?.access_token ?? null;
});

// ==================== SESSION ERROR HANDLING ====================

async function isSessionNotActive(error) {
    const response = error?.context;

    if (!(response instanceof Response) || response.status !== 404) {
        return false;
    }

    try {
        const body = await response.clone().json();
        return body?.code === "SESSION_NOT_ACTIVE";
    } catch {
        return false;
    }
}

async function readSessionErrorCode(error) {
    const response = error?.context;

    if (!(response instanceof Response)) {
        return null;
    }

    try {
        const body = await response.clone().json();

        return typeof body?.code === "string"
            ? body.code
            : null;
    } catch {
        return null;
    }
}

// ==================== EXPIRED SESSION RECOVERY ====================

async function recoverExpiredSession() {
    if (!authClient) return;
    if (pageIsClosing) return;
    if (!sessionRecoveryPending || sessionRecoveryInProgress) return;
    if (navigator.onLine === false) return;

    sessionRecoveryInProgress = true;

    try {
        const newId = await startSession();

        if (newId === null) {
            console.warn(
                "Could not create replacement session; will retry."
            );
            return;
        }

        sessionRecoveryPending = false;
        sessionNeedsResync = true;
        sessionIsPaused = false;
        desiredSessionPaused = document.hidden;

        console.info("Started replacement play session:", newId);

        if (pauseRequestInProgress === false) {
            setSessionPaused(document.hidden);
        }
    } catch (error) {
        console.warn("Session recovery failed:", error);
    } finally {
        sessionRecoveryInProgress = false;

        if (sessionNeedsResync) {
            schedulePauseRetry();
        }
    }
}

function markSessionExpired(sessionId) {
    if (activeSessionId !== sessionId) return;

    console.warn(
        "Play session was closed by the server; creating a new one."
    );

    activeSessionId = null;
    sessionRecoveryPending = true;
    sessionNeedsResync = true;
    sessionResyncVersion += 1;

    if (pauseRetryTimer !== null) {
        clearTimeout(pauseRetryTimer);
        pauseRetryTimer = null;
    }

    recoverExpiredSession();
}

// ==================== HEARTBEATS ====================

async function sendHeartbeat() {
    if (!authClient) return;
    if (pageIsClosing) return;
    if (activeSessionId === null) return;
    if (document.hidden || sessionIsPaused === true) return;
    if (sessionNeedsResync || navigator.onLine === false) return;
    if (pauseRequestInProgress || heartbeatInProgress) return;

    heartbeatInProgress = true;
    const sessionId = activeSessionId;

    try {
        const { error } = await authClient.functions.invoke(
            "heartbeat-session",
            {
                body: {
                    sessionId
                },
                signal: AbortSignal.timeout(SESSION_REQUEST_TIMEOUT_MS)
            }
        );

        if (activeSessionId !== sessionId) return;

        if (error !== null) {
            if (await isSessionNotActive(error)) {
                markSessionExpired(sessionId);
                return;
            }

            console.warn("Heartbeat failed:", error);
            sessionNeedsResync = true;
        }
    } catch (error) {
        if (activeSessionId === sessionId) {
            console.warn("Unable to send heartbeat:", error);
            sessionNeedsResync = true;
        }
    } finally {
        heartbeatInProgress = false;

        if (sessionNeedsResync) {
            schedulePauseRetry();
        }
    }
}

// ==================== PAUSE / RESUME RETRIES ====================

function schedulePauseRetry() {
    if (pageIsClosing) return;

    if (
        pauseRetryTimer !== null ||
        sessionNeedsResync === false
    ) {
        return;
    }

    if (navigator.onLine === false) return;

    if (
        activeSessionId === null &&
        !sessionRecoveryPending
    ) {
        return;
    }

    pauseRetryTimer = setTimeout(() => {
        pauseRetryTimer = null;

        if (
            !sessionNeedsResync ||
            navigator.onLine === false
        ) {
            return;
        }

        if (sessionRecoveryPending) {
            if (sessionRecoveryInProgress) {
                schedulePauseRetry();
            } else {
                recoverExpiredSession();
            }

            return;
        }

        if (pauseRequestInProgress) {
            schedulePauseRetry();
            return;
        }

        setSessionPaused(desiredSessionPaused);
    }, PAUSE_RETRY_DELAY_MS);
}

// ==================== VERSIONED PAUSE / RESUME ====================

async function setSessionPaused(paused) {
    if (!authClient) return;
    if (pageIsClosing) return;

    desiredSessionPaused = paused;

    if (sessionRecoveryPending) {
        schedulePauseRetry();
        return;
    }

    if (activeSessionId === null) return;

    if (navigator.onLine === false) {
        sessionNeedsResync = true;
        return;
    }

    if (pauseRequestInProgress) return;

    if (pauseRetryTimer !== null) {
        clearTimeout(pauseRetryTimer);
        pauseRetryTimer = null;
    }

    pauseRequestInProgress = true;

    const requestVersion = sessionResyncVersion;
    const sessionId = activeSessionId;

    sessionStateVersion += 1;
    const stateVersion = sessionStateVersion;

    try {
        const { data, error } =
            await authClient.functions.invoke(
                "set-session-paused",
                {
                    body: {
                        sessionId,
                        paused,
                        version: stateVersion
                    },
                    signal: AbortSignal.timeout(
                        SESSION_REQUEST_TIMEOUT_MS
                    )
                }
            );

        if (activeSessionId !== sessionId) return;

        if (error !== null) {
            const code = await readSessionErrorCode(error);

            if (activeSessionId !== sessionId) return;

            if (code === "SESSION_NOT_ACTIVE") {
                markSessionExpired(sessionId);
                return;
            }

            if (code === "STALE_SESSION_STATE") {
                console.warn(
                    "Outdated pause/resume request; retrying."
                );
            } else {
                console.warn(
                    "Pause/resume request failed:",
                    error
                );
            }

            sessionNeedsResync = true;
        } else if (data?.success === true) {
            sessionIsPaused = paused;

            sessionNeedsResync = !(
                requestVersion === sessionResyncVersion &&
                desiredSessionPaused === paused &&
                navigator.onLine === true
            );
        } else {
            console.warn(
                "Pause/resume was not confirmed:",
                data
            );

            sessionNeedsResync = true;
        }
    } catch (error) {
        if (activeSessionId === sessionId) {
            console.warn(
                "Unable to change session state:",
                error
            );

            sessionNeedsResync = true;
        }
    } finally {
        pauseRequestInProgress = false;

        if (navigator.onLine === true) {
            if (sessionRecoveryPending) {
                schedulePauseRetry();
            } else if (activeSessionId !== sessionId) {
                if (sessionNeedsResync) {
                    schedulePauseRetry();
                }
            } else if (
                desiredSessionPaused !== paused ||
                requestVersion !== sessionResyncVersion
            ) {
                setSessionPaused(desiredSessionPaused);
            } else if (sessionNeedsResync) {
                schedulePauseRetry();
            }
        }
    }
}

// ==================== BROWSER EVENTS ====================

document.addEventListener("visibilitychange", () => {
    setSessionPaused(document.hidden);
});

window.addEventListener("offline", () => {
    sessionNeedsResync = true;
    sessionResyncVersion += 1;

    if (pauseRetryTimer !== null) {
        clearTimeout(pauseRetryTimer);
        pauseRetryTimer = null;
    }
});

window.addEventListener("online", () => {
    if (activeSessionId === null && sessionRecoveryPending === false) {
        ensureGameSessionStarted();
        return;
    }

    sessionNeedsResync = true;
    sessionResyncVersion += 1;

    if (sessionRecoveryPending) {
        recoverExpiredSession();
    } else {
        setSessionPaused(document.hidden);
    }
});

// ==================== SESSION CLOSING ====================

function sendSessionCloseRequest(sessionId) {
    if (sessionCloseAccessToken === null) return;

    try {
        fetch(SUPABASE_URL + "/functions/v1/end-session", {
            method: "POST",
            keepalive: true,
            headers: {
                "Content-Type": "application/json",
                apikey: SUPABASE_PUBLISHABLE_KEY,
                Authorization: `Bearer ${sessionCloseAccessToken}`
            },
            body: JSON.stringify({ sessionId })
        }).then(response => {
            if (!response.ok) {
                console.warn("Session close returned:", response.status);
            }
        }).catch(error => {
            console.warn("Session close request failed:", error);
        });
    } catch (error) {
        console.warn("Unable to send session close request:", error);
    }
}

function closeSessionOnExit() {
    if (!authClient) return;
    if (activeSessionId === null) return;

    const sessionId = activeSessionId;
    activeSessionId = null;

    sendSessionCloseRequest(sessionId);
}

window.addEventListener("pagehide", event => {
    if (event.persisted === true) return;

    pageIsClosing = true;

    if (sessionStartupRetryTimer !== null) {
        clearTimeout(sessionStartupRetryTimer);
        sessionStartupRetryTimer = null;
    }

    if (pauseRetryTimer !== null) {
        clearTimeout(pauseRetryTimer);
        pauseRetryTimer = null;
    }

    closeSessionOnExit();
});

// ==================== HEARTBEAT TIMER ====================

setInterval(() => {
    sendHeartbeat();
}, 30000);


// ==================== INPUT ====================

const keys = {}, hit = {};
let opt = { m: 5, s: 7 };

addEventListener('keydown', e => {
    if (!keys[e.code]) hit[e.code] = 1;
    keys[e.code] = 1;

    if (/Space|Arrow/.test(e.code)) e.preventDefault();
    if (e.code == 'KeyF') fs();

    initA();
});

addEventListener('keyup', e => keys[e.code] = 0);

const ok = () => hit.Space || hit.Enter || hit.KeyZ,
    up = () => hit.ArrowUp || hit.KeyW,
    dn = () => hit.ArrowDown || hit.KeyS,
    lf = () => hit.ArrowLeft || hit.KeyA,
    rt = () => hit.ArrowRight || hit.KeyD,
    esc = () => hit.Escape;

function fs() {
    try {
        document.fullscreenElement
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen()
    } catch (e) { }
}

// ==================== AUDIO (TINY SYNTH) ====================

let AC;

function initA() {
    if (!AC) {
        try {
            AC = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { }
    }
}

function beep(f, d = .08, v = 1, t = 'square') {
    if (!AC) return;

    const o = AC.createOscillator(), g = AC.createGain();

    o.type = t;
    o.frequency.value = f;
    g.gain.value = .05 * opt.s / 10 * v;

    g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d);

    o.connect(g);
    g.connect(AC.destination);

    o.start();
    o.stop(AC.currentTime + d);
}

// ==================== DRAWING HELPERS ====================

const r = (x, y, w, h, c, G = X) => {
    G.fillStyle = c;

    const a = Math.round(x), b = Math.round(y);

    G.fillRect(
        a,
        b,
        Math.round(x + w) - a,
        Math.round(y + h) - b
    );
};

function ell(cx, cy, rx, ry, c, G = X) {
    G.fillStyle = c;
    rx = Math.max(.5, rx);
    ry = Math.max(.5, ry);

    for (let j = -Math.round(ry); j <= Math.round(ry); j++) {
        const q = 1 - (j * j) / (ry * ry);
        if (q < 0) continue;

        const w = Math.round(rx * Math.sqrt(q));

        G.fillRect(
            Math.round(cx) - w,
            Math.round(cy) + j,
            w * 2,
            1
        );
    }
}

function sh(h, f) {
    // Lighten/darken a #rrggbb colour
    const n = parseInt(h.slice(1), 16);
    const c = i => Math.max(
        0,
        Math.min(255, Math.round(((n >> i) & 255) * f))
    );

    return '#' + [16, 8, 0]
        .map(i => c(i).toString(16).padStart(2, '0'))
        .join('');
}

// ==================== TEXT & FONTS ====================

const FONT = '"Synchronicity Hand", "Comic Neue", cursive';

const CRAZYF = FONT;   // v73: the shaky "crazy" font is no longer used anywhere

let TXTF = null;
// When set, txt() and tw() use this font instead.

function txt(s, x, y, c = '#fff', al = 'left', sz = 8) {
    // UI-layer text: rendered at native resolution, never scaled
    X.save();
    X.setTransform(1, 0, 0, 1, 0, 0);

    X.font = Math.round(sz * U) + 'px ' + (TXTF || FONT);
    X.textAlign = al;
    X.textBaseline = 'top';
    X.fillStyle = c;

    X.fillText(
        s,
        Math.round(x * U),
        Math.round(y * U)
    );

    X.restore();
}

const tw = (s, sz = 8) => {
    X.save();
    X.setTransform(1, 0, 0, 1, 0, 0);

    X.font = Math.round(sz * U) + 'px ' + (TXTF || FONT);

    const w = X.measureText(s).width / U;

    X.restore();
    return w;
};

function wrap(s, n) {
    const o = [];
    let l = '';

    for (const w of s.split(' ')) {
        if ((l + w).length > n) {
            o.push(l);
            l = '';
        }

        l += w + ' ';
    }

    o.push(l);
    return o;
}

// ==================== MATH HELPERS ====================

const rng = s => () =>
    (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;

const hsh = (x, y, k = 0) =>
    ((x * 73856093 ^ y * 19349663 ^ k * 83492791) >>> 0) % 1000 / 1000;

const clamp = (v, a, b) =>
    Math.max(a, Math.min(b, v));

// ==================== MUSIC ====================
// Real tracks, cross-faded.
// Started after the first key press (browser autoplay rule).

const TRACKS = {
    menu: 'eternal_rest',
    forest: 'green_aero_neon',
    dark: 'eight',
    beach: 'inabakumori',
    scary: 'morbid_curiosity',
    inboredom: 'inboredom'
};

const MUS = {};
let musCur = null;

function trackAudio(k) {
    if (!MUS[k]) {
        const a = new Audio('assets/music/' + TRACKS[k] + '.mp3');
        a.loop = true;
        a.volume = 0;
        MUS[k] = a;
    }

    return MUS[k];
}

function music(k) {
    if (k === musCur) return;
    musCur = k;
}

setInterval(() => {
    // Fade the wanted track in and everything else out
    const vol = opt.m / 10 * .7;

    for (const k in TRACKS) {
        const a = trackAudio(k);
        const want = k === musCur ? vol : 0;

        if (want > 0 && a.paused && AC) {
            a.play().catch(() => { });
        }

        a.volume = clamp(
            a.volume + clamp(want - a.volume, -.04, .04),
            0,
            1
        );

        if (want == 0 && a.volume < .01 && !a.paused) {
            a.pause();
        }
    }
}, 60);

// ==================== SOUND EFFECTS ====================
// Synthesised sound effects.

function noiseBurst(dur = .2, freq = 1800, q = 1, vol = .5, delay = 0) {
    if (!AC) return;

    const n = AC.sampleRate * dur | 0;
    const buf = AC.createBuffer(1, n, AC.sampleRate);
    const d = buf.getChannelData(0);

    for (let i = 0; i < n; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.2);
    }

    const s = AC.createBufferSource();
    const f = AC.createBiquadFilter();
    const g = AC.createGain();

    s.buffer = buf;
    f.type = 'bandpass';
    f.frequency.value = freq;
    f.Q.value = q;
    g.gain.value = vol * opt.s / 10;

    s.connect(f);
    f.connect(g);
    g.connect(AC.destination);

    s.start(AC.currentTime + delay);
}

function bookOpen() {
    noiseBurst(.28, 900, .7, .55);
    noiseBurst(.14, 2600, 1.2, .35, .16);
    noiseBurst(.1, 400, .8, .5, .3);
    beep(95, .16, 1.2, 'sine');
}
// Cover thud + pages fanning

function pageTurn() {
    noiseBurst(.18, 2200, .9, .4);
    noiseBurst(.1, 3400, 1.2, .25, .1);
}

function jumpscareSound() {
    noiseBurst(.7, 700, .4, 1);
    beep(60, .6, 3, 'sawtooth');
    beep(95, .6, 3, 'square');
    beep(1400, .5, 1.5, 'sawtooth');
}

function heartbeat() {
    beep(55, .12, 2.5, 'sine');
    setTimeout(() => beep(48, .14, 2, 'sine'), 170);
}