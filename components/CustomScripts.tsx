"use client";

import { useEffect } from "react";

interface CustomScriptsProps {
    headCode?: string;
    bodyCode?: string;
    footerCode?: string;
}

/**
 * Injects arbitrary HTML (scripts, meta tags, tracking pixels, etc.)
 * from WordPress CMS into the correct document positions.
 *
 * Uses DOM APIs to properly handle <script> tags (which don't execute via innerHTML).
 * Runs client-side only to avoid hydration mismatches.
 */
function injectHTML(html: string, target: HTMLElement) {
    // createContextualFragment parses the HTML and executes <script> tags
    // when the fragment is appended to the DOM
    const range = document.createRange();
    const fragment = range.createContextualFragment(html);
    target.appendChild(fragment);
}

export default function CustomScripts({ headCode, bodyCode, footerCode }: CustomScriptsProps) {
    useEffect(() => {
        if (headCode) {
            injectHTML(headCode, document.head);
        }
    }, [headCode]);

    useEffect(() => {
        if (bodyCode) {
            // Insert at the beginning of body (after opening <body>)
            const container = document.createElement("div");
            container.id = "wp-body-scripts";
            container.style.display = "none";
            document.body.prepend(container);
            injectHTML(bodyCode, container);
        }
    }, [bodyCode]);

    useEffect(() => {
        if (footerCode) {
            // Insert at the end of body (before closing </body>)
            const container = document.createElement("div");
            container.id = "wp-footer-scripts";
            container.style.display = "none";
            document.body.appendChild(container);
            injectHTML(footerCode, container);
        }
    }, [footerCode]);

    return null;
}
