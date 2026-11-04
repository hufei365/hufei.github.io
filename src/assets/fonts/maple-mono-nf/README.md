# Maple Mono NF

Source: https://github.com/subframe7536/maple-font/releases/tag/v7.9
Archive: MapleMono-NF.zip
Archive SHA-256: 59098b87c895d871635d37680e88000ae2b2b25b55428195b228ec589e35fb89
License: SIL Open Font License 1.1, reproduced in LICENSE.txt from the archive.

These are the original, unmodified Regular, Bold, Italic and BoldItalic TTF files from the verified release archive. They retain Nerd Fonts symbols and the original font names. No Chinese glyph expansion (NF-CN) is included.

BlogPost.astro imports src/styles/code-font.css. Its @font-face rules prefer an installed matching face, then load these site-hosted assets; Astro/Vite handles the /blog base path and asset URLs. Only code-related elements inside .content use this font; prose typography is unchanged. Standard/contextual ligatures are enabled, and font-display: swap keeps code readable while the font loads.

Each face is shipped as WOFF2 (approximately 0.92–0.94 MiB per face before HTTP compression, 59.47% smaller than the original TTFs; total 3,891,904 bytes vs 9,601,932 bytes), loaded on demand. The WOFF2 conversion was verified to preserve glyph order, character mapping, metrics, layout tables and per-glyph outlines; the original TTFs remain in the official release archive, which serves as the source backup.
