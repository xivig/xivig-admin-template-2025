/**
 * Loads JSON data safely across both HTTP(S) (`fetch`) and `file://` (CORS-free dynamic script fallback).
 */
export async function loadStaticDataset({ jsonPaths, scriptPaths, globalVar }) {
    if (window[globalVar] !== undefined) {
        return window[globalVar];
    }

    // 1. Over HTTP(S), try JSON endpoints via fetch()
    if (window.location.protocol !== 'file:') {
        for (const url of jsonPaths) {
            try {
                const res = await fetch(url);
                const contentType = res.headers.get('content-type') || '';
                if (res.ok && contentType.includes('application/json')) {
                    const data = await res.json();
                    window[globalVar] = data;
                    return data;
                }
            } catch {
                // Fall through to next candidate path
            }
        }
    }

    // 2. Fallback (always used on file:// where fetch is CORS-blocked): dynamic classic <script> loader
    for (const scriptUrl of scriptPaths) {
        try {
            const loaded = await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = scriptUrl;
                script.async = true;
                script.onload = () => {
                    if (window[globalVar] !== undefined) {
                        resolve(window[globalVar]);
                    } else {
                        reject(new Error(`Loaded ${scriptUrl} cleanly, but window.${globalVar} was undefined`));
                    }
                };
                script.onerror = () => reject(new Error(`Failed to load ${scriptUrl}`));
                document.head.appendChild(script);
            });
            return loaded;
        } catch {
            // Try next fallback path
        }
    }

    throw new Error(`Unable to load dataset (${globalVar}) from JSON or fallback script paths.`);
}
