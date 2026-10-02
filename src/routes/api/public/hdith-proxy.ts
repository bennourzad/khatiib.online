import { createFileRoute } from "@tanstack/react-router";

const HDITH_ORIGIN = "https://hdith.com";
const PROXY_ROUTE = "/api/public/hdith-proxy";

function stripUnsafeHeaders(headers: Headers) {
  headers.delete("x-frame-options");
  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.delete("set-cookie");
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("link");
}

function buildTargetUrl(requestUrl: URL) {
  const path = requestUrl.searchParams.get("path") ?? "/s";

  if (!path.startsWith("/")) {
    throw new Response("Invalid path", { status: 400 });
  }

  const targetUrl = new URL(path, HDITH_ORIGIN);

  requestUrl.searchParams.forEach((value, key) => {
    if (key !== "path") targetUrl.searchParams.append(key, value);
  });

  return targetUrl;
}

function toProxyUrl(value: string, baseUrl: URL) {
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("data:") ||
    value.startsWith("javascript:") ||
    value.startsWith(PROXY_ROUTE)
  ) {
    return value;
  }

  const absoluteUrl = new URL(value, baseUrl);
  if (absoluteUrl.origin !== HDITH_ORIGIN) return value;

  const params = new URLSearchParams();
  params.set("path", absoluteUrl.pathname);
  absoluteUrl.searchParams.forEach((paramValue, key) => {
    params.append(key, paramValue);
  });

  return `${PROXY_ROUTE}?${params.toString()}`;
}

function rewriteQuotedPaths(text: string, baseUrl: URL) {
  return text.replace(
    /(["'])(https?:\/\/hdith\.com[^"']*|\.{1,2}\/[^"']*|\/[^"']*)(\1)/gi,
    (_match, quote, originalValue, closingQuote) => {
      const nextValue = toProxyUrl(originalValue, baseUrl);
      return `${quote}${nextValue}${closingQuote}`;
    },
  );
}

function rewriteCss(css: string, baseUrl: URL) {
  return rewriteQuotedPaths(
    css.replace(/url\((['"]?)([^)'"\s]+)\1\)/gi, (_match, quote, originalValue) => {
      const nextValue = toProxyUrl(originalValue, baseUrl);
      const wrapped = quote || "";
      return `url(${wrapped}${nextValue}${wrapped})`;
    }),
    baseUrl,
  );
}

function rewriteJavaScript(script: string, baseUrl: URL) {
  return rewriteQuotedPaths(script, baseUrl);
}

function injectFormPath(html: string) {
  return html.replace(/<form\b([^>]*)>/gi, (match, attrs: string) => {
    const actionMatch = attrs.match(/action="([^"]*)"/i);
    if (!actionMatch) return match;
    const action = actionMatch[1];
    if (!action.startsWith(PROXY_ROUTE)) return match;
    try {
      const parsed = new URL(action, "http://placeholder.local");
      const path = parsed.searchParams.get("path");
      if (!path) return match;
      const newAttrs = attrs.replace(/action="[^"]*"/i, `action="${PROXY_ROUTE}"`);
      return `<form${newAttrs}><input type="hidden" name="path" value="${path}">`;
    } catch {
      return match;
    }
  });
}

function injectSearchFormBridge(html: string, baseUrl: URL) {
  if (baseUrl.pathname !== "/" && baseUrl.pathname !== "/s") {
    return html;
  }

  const searchFormOpenPattern = /<form\b([^>]*)>(?=[\s\S]{0,2000}?(?:<button\b[^>]*type=(['"])submit\2|<input\b[^>]*type=(['"])submit\3))(?=[\s\S]{0,2000}?<input\b[^>]*(?:placeholder=(['"])[^"']*(?:حديث|ابحث)[^"']*\4|inputMode=(['"])search\5|inputmode=(['"])search\6|enterKeyHint=(['"])search\7|enterkeyhint=(['"])search\8))/i;
  const searchInputPattern = /<input\b([^>]*?(?:placeholder=(['"])[^"']*(?:حديث|ابحث)[^"']*\2|inputMode=(['"])search\3|inputmode=(['"])search\4|enterKeyHint=(['"])search\5|enterkeyhint=(['"])search\6)[^>]*?)(\/)?>/gi;

  const staticallyPatchedHtml = html
    .replace(searchFormOpenPattern, (_match, attrs: string) => {
      const sanitizedAttrs = attrs
        .replace(/\saction=("[^"]*"|'[^']*')/gi, "")
        .replace(/\smethod=("[^"]*"|'[^']*')/gi, "");

      return `<form${sanitizedAttrs} action="${PROXY_ROUTE}" method="get"><input type="hidden" name="path" value="/s">`;
    })
    .replace(searchInputPattern, (match, attrs: string, _quoteA, _quoteB, _quoteC, _quoteD, _quoteE, selfClosing: string) => {
      if (/\sname=/i.test(attrs)) return match;
      return `<input${attrs} name="q"${selfClosing ?? ""}>`;
    });

  const bridgeScript = `<script>(function(){
    const PROXY_ROUTE = ${JSON.stringify(PROXY_ROUTE)};
    const DEFAULT_PATH = "/s";

    function getSearchInput(form) {
      return form.querySelector('input[name="q"], input[type="search"], input[inputmode="search"], input[enterkeyhint="search"], input[placeholder*="حديث"], input[placeholder*="ابحث"]');
    }

    function prepareForm(form) {
      const input = getSearchInput(form);
      const submit = form.querySelector('button[type="submit"], input[type="submit"]');
      if (!input || !submit) return null;

      if (!input.getAttribute("name")) {
        input.setAttribute("name", "q");
      }

      form.setAttribute("method", "get");
      form.setAttribute("action", PROXY_ROUTE);

      let pathInput = form.querySelector('input[name="path"]');
      if (!(pathInput instanceof HTMLInputElement)) {
        pathInput = document.createElement("input");
        pathInput.type = "hidden";
        pathInput.name = "path";
        form.appendChild(pathInput);
      }

      pathInput.value = DEFAULT_PATH;
      return input;
    }

    function patchForms() {
      document.querySelectorAll("form").forEach((form) => {
        if (form instanceof HTMLFormElement) prepareForm(form);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", patchForms, { once: true });
    } else {
      patchForms();
    }

    const observer = new MutationObserver(() => patchForms());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener("submit", (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      const input = prepareForm(form);
      if (!(input instanceof HTMLInputElement)) return;

      event.preventDefault();
      const params = new URLSearchParams();
      params.set("path", DEFAULT_PATH);
      const query = input.value.trim();
      if (query) params.set("q", query);
      window.location.assign(PROXY_ROUTE + "?" + params.toString());
    }, true);
  })();</script>`;

  return staticallyPatchedHtml.includes("</body>")
    ? staticallyPatchedHtml.replace("</body>", `${bridgeScript}</body>`)
    : `${staticallyPatchedHtml}${bridgeScript}`;
}

function rewriteHtml(html: string, baseUrl: URL) {
  const rewritten = rewriteQuotedPaths(
    html
    .replace(/target=("|')_top\1/gi, 'target="_self"')
    .replace(/(href|src|action)=("([^"]*)"|'([^']*)')/gi, (_match, attr, _quoted, doubleQuotedValue, singleQuotedValue) => {
      const originalValue = doubleQuotedValue ?? singleQuotedValue ?? "";
      const nextValue = toProxyUrl(originalValue, baseUrl);
      return `${attr}="${nextValue}"`;
      }),
    baseUrl,
  );
  return injectSearchFormBridge(injectFormPath(rewritten), baseUrl);
}

export const Route = createFileRoute("/api/public/hdith-proxy")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const targetUrl = buildTargetUrl(requestUrl);

        const upstream = await fetch(targetUrl, {
          headers: {
            "accept-language": "ar,en;q=0.8",
            "user-agent": "Mozilla/5.0 (compatible; Khatiib Hadith Proxy)",
          },
        });

        const headers = new Headers(upstream.headers);
        stripUnsafeHeaders(headers);

        const contentType = headers.get("content-type") ?? "text/html; charset=utf-8";
        if (contentType.includes("text/html")) {
          const html = await upstream.text();
          return new Response(rewriteHtml(html, targetUrl), {
            status: upstream.status,
            headers,
          });
        }

        if (contentType.includes("text/css")) {
          const css = await upstream.text();
          return new Response(rewriteCss(css, targetUrl), {
            status: upstream.status,
            headers,
          });
        }

        if (
          contentType.includes("javascript") ||
          contentType.includes("ecmascript") ||
          contentType.includes("json")
        ) {
          const script = await upstream.text();
          return new Response(rewriteJavaScript(script, targetUrl), {
            status: upstream.status,
            headers,
          });
        }

        return new Response(upstream.body, {
          status: upstream.status,
          headers,
        });
      },
    },
  },
});