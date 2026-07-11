/**
 * Iconify — unit tests for the pure logic (no browser required).
 *
 * The content scripts assume a browser (jQuery, window, DOM). We load them into
 * a Node `vm` sandbox with lightweight stubs, then exercise the pure helper
 * functions and the logger directly.
 *
 * Run:  node tests/run-tests.js   (or:  npm test)
 *
 * These cover logic we can verify off-browser. The real per-site download flows
 * (Flaticon / IconScout / Icons8 / FontAwesome) need a logged-in browser and are
 * covered by the manual checklist in tests/MANUAL_TESTS.md.
 */
"use strict";

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const SRC = path.join(__dirname, "..", "scripts");

/* ------------------------------------------------------------------ */
/* tiny assertion helpers                                              */
/* ------------------------------------------------------------------ */
let passed = 0;
let failed = 0;
function ok(name, cond) {
    if (cond) { passed++; console.log("  PASS  " + name); }
    else      { failed++; console.log("  FAIL  " + name); }
}
function eq(name, actual, expected) {
    ok(name + "  (got: " + JSON.stringify(actual) + ")", actual === expected);
}

/* ------------------------------------------------------------------ */
/* browser stubs                                                      */
/* ------------------------------------------------------------------ */
function makeStore(initial) {
    const map = new Map(Object.entries(initial || {}));
    return {
        get length() { return map.size; },
        key(i) { return Array.from(map.keys())[i]; },
        getItem(k) { return map.has(k) ? map.get(k) : null; },
        setItem(k, v) { map.set(k, String(v)); },
        removeItem(k) { map.delete(k); }
    };
}

// A jQuery-ish stub: any call returns itself, common accessors are harmless.
function makeJQ() {
    const handler = {
        get(_t, prop) {
            if (prop === "length") return 0;
            if (prop === Symbol.toPrimitive) return () => "";
            return function () { return proxy; };
        },
        apply() { return proxy; }
    };
    const proxy = new Proxy(function () {}, handler);
    return proxy;
}

function buildSandbox(opts) {
    opts = opts || {};
    const sandbox = {
        console: console,
        JSON: JSON, Math: Math, Array: Array, Object: Object,
        String: String, Number: Number, Boolean: Boolean, RegExp: RegExp,
        Date: Date, Error: Error, Proxy: Proxy, Symbol: Symbol,
        atob: (s) => Buffer.from(s, "base64").toString("binary"),
        setTimeout: setTimeout, clearTimeout: clearTimeout,
        performance: { now: () => 0, getEntries: opts.entries || (() => []) },
        localStorage: makeStore(opts.localStorage),
        location: { href: opts.href || "https://iconscout.com/" },
        Snackbar: { show() {} },
        fetch: () => Promise.reject(new Error("fetch not available in tests")),
        URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} },
        addEventListener() {},
        removeEventListener() {}
    };
    sandbox.window = sandbox;
    sandbox.document = {
        cookie: opts.cookie || "",
        createElement: () => ({ setAttribute() {}, style: {}, click() {}, appendChild() {} }),
        head: { appendChild() {} },
        body: {},
        addEventListener() {},
        querySelector: () => opts.querySelector ? opts.querySelector() : null,
        querySelectorAll: () => []
    };
    sandbox.$ = function () { return makeJQ(); };
    sandbox.$.ajax = function () {};
    vm.createContext(sandbox);
    return sandbox;
}

function loadScripts(sandbox) {
    const logger = fs.readFileSync(path.join(SRC, "iconify-logger.js"), "utf8");
    const main   = fs.readFileSync(path.join(SRC, "iconify-main.js"), "utf8");
    vm.runInContext(logger, sandbox, { filename: "iconify-logger.js" });
    vm.runInContext(main, sandbox, { filename: "iconify-main.js" });
    return sandbox;
}

/* ------------------------------------------------------------------ */
/* TESTS                                                              */
/* ------------------------------------------------------------------ */

console.log("\n[1] Logger");
(function () {
    const sb = buildSandbox();
    loadScripts(sb);
    const I = sb.Iconify;
    ok("Iconify.log exists",   !!(I && I.log));
    ok("Iconify.track exists", typeof I.track === "function");
    ok("Iconify.debug exists", typeof I.debug === "function");
    ok("Iconify.diagnose exists", typeof I.diagnose === "function");

    // track() must expose done/fail and be idempotent
    const t = I.track("Test", "action", {});
    ok("track returns done()", typeof t.done === "function");
    ok("track returns fail()", typeof t.fail === "function");
    let threw = false;
    try { t.done(); t.fail(new Error("late")); } catch (e) { threw = true; }
    ok("double-resolve does not throw", !threw);

    // debug() toggles and persists to localStorage
    I.debug(true);
    eq("debug persists ON", sb.localStorage.getItem("iconify:debug"), "1");
    I.debug(false);
    eq("debug persists OFF", sb.localStorage.getItem("iconify:debug"), "0");
})();

console.log("\n[2] detectIconScoutType (URL-based type detection)");
(function () {
    const sb = buildSandbox();
    loadScripts(sb);
    const detect = sb.detectIconScoutType;
    ok("function is exposed", typeof detect === "function");
    eq("lottie url -> lottie", detect("https://iconscout.com/lottie-animation/chess-animation_8372007"), "lottie");
    eq("animated-icon -> lottie", detect("https://iconscout.com/animated-icons/loading_123"), "lottie");
    eq("3d-illustration -> 3d", detect("https://iconscout.com/3d-illustration/rocket_1"), "3d");
    eq("3d-icon -> 3d", detect("https://iconscout.com/3d-icons/home_2"), "3d");
    eq("plain icon -> svg", detect("https://iconscout.com/icon/home_9"), "svg");
    eq("free-icon -> svg", detect("https://iconscout.com/free-icon/settings_5"), "svg");
    eq("illustration -> svg", detect("https://iconscout.com/illustration/team_3"), "svg");
    eq("empty url falls back to svg", detect("", 0, { length: 0 }, { length: 0 }), "svg");
})();

console.log("\n[3] searchUuidField / findUuidInStorage (uuid recovery)");
(function () {
    const UUID = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";

    // (a) old known key
    let sb = buildSandbox({ localStorage: { __user_traits: JSON.stringify({ uuid: UUID }) } });
    loadScripts(sb);
    eq("finds uuid in __user_traits", sb.findUuidInStorage() && sb.findUuidInStorage().value, UUID);

    // (b) uuid moved to a renamed key + nested path
    sb = buildSandbox({ localStorage: {
        randomCache: JSON.stringify({ foo: 1 }),
        userProfileData: JSON.stringify({ account: { user_id: UUID } })
    }});
    loadScripts(sb);
    const hit = sb.findUuidInStorage();
    eq("finds uuid in renamed/nested key", hit && hit.value, UUID);

    // (c) nothing uuid-shaped present
    sb = buildSandbox({ localStorage: { theme: JSON.stringify({ dark: true }) } });
    loadScripts(sb);
    eq("returns null when no uuid", sb.findUuidInStorage(), null);

    // (d) searchUuidField ignores non-uuid strings on id-like fields
    sb = buildSandbox();
    loadScripts(sb);
    eq("id field with non-uuid value ignored", sb.searchUuidField({ id: "12345" }), null);
    const nested = sb.searchUuidField({ a: { b: { uuid: UUID } } });
    eq("searchUuidField digs into nested objects", nested && nested.value, UUID);
})();

console.log("\n[4] getFlaticonPremiumToken (cookie recovery)");
(function () {
    let sb = buildSandbox({ cookie: "foo=bar; _auth_premium_token=TOKEN123; x=y" });
    loadScripts(sb);
    eq("reads _auth_premium_token from cookie", sb.getFlaticonPremiumToken(), "TOKEN123");

    sb = buildSandbox({ cookie: "foo=bar" });
    loadScripts(sb);
    eq("returns empty string when absent", sb.getFlaticonPremiumToken(), "");
})();

console.log("\n[5] extractTokenFromUrls (IconScout token from performance entries)");
(function () {
    const entries = () => ([
        { initiatorType: "img",   name: "https://cdn/foo.png" },
        { initiatorType: "fetch", name: "https://iconscout.com/api/download/999?token=ABC" },
        { initiatorType: "xmlhttprequest", name: "https://iconscout.com/api/download/999?token=XYZ" }
    ]);
    const sb = buildSandbox({ entries });
    loadScripts(sb);
    const token = sb.extractTokenFromUrls("999");
    ok("returns the last matching ?token= url for the product",
        typeof token === "string" && token.indexOf("token=XYZ") !== -1);
    eq("returns null when product id not present", sb.extractTokenFromUrls("000"), null);
})();

/* ------------------------------------------------------------------ */
console.log("\n----------------------------------------");
console.log("  " + passed + " passed, " + failed + " failed");
console.log("----------------------------------------\n");
process.exit(failed === 0 ? 0 : 1);
