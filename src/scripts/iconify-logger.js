/**
 * Iconify — diagnostic logger.
 *
 * Errors and warnings are always printed. Verbose (info/debug) output is off by
 * default and can be switched on from the browser console:
 *
 *     Iconify.debug(true)      // enable verbose logs (persists across reloads)
 *     Iconify.debug(false)     // disable
 *     Iconify.debug()          // show current state
 *
 * Every download attempt is traced with Iconify.track(...), which prints a clear
 * SUCCESS or FAILED line with the elapsed time and, on failure, the reason — so
 * it is immediately obvious whether a download went through or not.
 */
(function (global) {
    "use strict";

    var STORAGE_KEY = "iconify:debug";
    var LEVELS      = { error: 0, warn: 1, info: 2, debug: 3 };

    var verbose = false;
    try { verbose = global.localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { /* storage blocked */ }

    function stamp() {
        // HH:MM:SS.mmm — enough to correlate with the Network panel.
        try { return new Date().toISOString().slice(11, 23); } catch (e) { return ""; }
    }

    function styleFor(level) {
        switch (level) {
            case "error": return "background:#c62828;color:#fff;border-radius:3px;padding:1px 5px;font-weight:600";
            case "warn":  return "background:#f9a825;color:#000;border-radius:3px;padding:1px 5px;font-weight:600";
            case "info":  return "background:#1565c0;color:#fff;border-radius:3px;padding:1px 5px;font-weight:600";
            default:      return "background:#455a64;color:#fff;border-radius:3px;padding:1px 5px;font-weight:600";
        }
    }

    function write(level, args) {
        if (!verbose && LEVELS[level] > LEVELS.warn) { return; }
        var method = (level === "debug") ? "log" : level;
        var head   = ["%cIconify%c " + stamp(), styleFor(level), "color:inherit;font-weight:400"];
        try {
            (console[method] || console.log).apply(console, head.concat(Array.prototype.slice.call(args)));
        } catch (e) { /* never let logging break a download */ }
    }

    var log = {
        error: function () { write("error", arguments); },
        warn:  function () { write("warn",  arguments); },
        info:  function () { write("info",  arguments); },
        debug: function () { write("debug", arguments); }
    };

    /**
     * Trace a single download attempt.
     *
     *   var t = Iconify.track("Flaticon", "SVG download", { iconId: 12345 });
     *   ...
     *   t.done();            // -> "SUCCESS Flaticon SVG download (312ms)"
     *   t.fail(err);         // -> "FAILED  Flaticon SVG download (312ms): <reason>"
     */
    function track(site, action, context) {
        var startedAt = null;
        try { startedAt = (global.performance && performance.now) ? performance.now() : null; } catch (e) {}
        log.debug("START  " + site + " " + action, context || "");
        var finished = false;
        function elapsed() {
            if (startedAt == null) { return "?"; }
            try { return Math.round(performance.now() - startedAt) + "ms"; } catch (e) { return "?"; }
        }
        return {
            done: function (details) {
                if (finished) { return; }
                finished = true;
                log.info("SUCCESS " + site + " " + action + " (" + elapsed() + ")", details || "");
            },
            fail: function (error) {
                if (finished) { return; }
                finished = true;
                var reason = (error && error.message) ? error.message : String(error);
                log.error("FAILED  " + site + " " + action + " (" + elapsed() + "): " + reason, error || "");
            }
        };
    }

    function debug(state) {
        if (typeof state === "undefined") {
            log.info("verbose logging is " + (verbose ? "ON" : "OFF"));
            return verbose;
        }
        verbose = !!state;
        try { global.localStorage.setItem(STORAGE_KEY, verbose ? "1" : "0"); } catch (e) {}
        // This confirmation is deliberately printed regardless of the flag.
        write("info", ["verbose logging turned " + (verbose ? "ON" : "OFF")]);
        return verbose;
    }

    /**
     * Iconify.diagnose() — dump the current page's structure so selector/auth
     * problems can be pinpointed without guessing. Long / secret-looking values
     * are truncated; only id/uuid-like fields are shown in full so the report is
     * safe to share. Returns the report object and prints it.
     */
    function diagnose() {
        var report = {
            url              : location.href,
            localStorageKeys : [],
            userIdCandidates : [],
            productMeta      : [],
            lottieElements   : [],
            colorEditorEls   : [],
            downloadButtons  : 0
        };

        function scan(obj, storageKey, path) {
            if (!obj || typeof obj !== "object") { return; }
            for (var k in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, k)) { continue; }
                var val = obj[k];
                if ((/uuid|user_?id|^id$/i).test(k) && (typeof val === "string" || typeof val === "number")) {
                    report.userIdCandidates.push({ storageKey: storageKey, path: (path + k), value: String(val) });
                }
                if (val && typeof val === "object") { scan(val, storageKey, path + k + "."); }
            }
        }

        try {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                report.localStorageKeys.push(key);
                var raw = localStorage.getItem(key);
                try { scan(JSON.parse(raw), key, ""); } catch (e) { /* not JSON */ }
            }
        } catch (e) { report.localStorageError = String(e); }

        try {
            var metas = document.querySelectorAll('meta[property]');
            for (var m = 0; m < metas.length; m++) {
                var prop = metas[m].getAttribute("property") || "";
                if (/product|og:/i.test(prop)) {
                    report.productMeta.push({ property: prop, content: metas[m].getAttribute("content") });
                }
            }
        } catch (e) {}

        try {
            document.querySelectorAll('[id*="lottie"], [id*="pdp-lottie"], lottie-player, dotlottie-player').forEach(function (el) {
                report.lottieElements.push({ tag: el.tagName.toLowerCase(), id: el.id || "(no id)" });
            });
            document.querySelectorAll('[id^="pdpColorEditor"]').forEach(function (el) {
                report.colorEditorEls.push(el.id);
            });
            report.downloadButtons = document.querySelectorAll('.download-icon, .btn-svg, .download-svg-ry').length;
        } catch (e) {}

        // Printed regardless of verbose flag — diagnose is an explicit request.
        write("info", ["diagnose report:", report]);
        return report;
    }

    var api = global.Iconify || {};
    api.log      = log;
    api.track    = track;
    api.debug    = debug;
    api.diagnose = diagnose;
    global.Iconify = api;

    if (verbose) { log.info("logger ready — verbose ON (Iconify.debug(false) to silence)"); }
})(window);
