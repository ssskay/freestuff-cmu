import { describe, it, expect } from 'vitest';
import { renderOgSvg, accentHexFromTokens } from '../../scripts/gen-og.mts';
import sharp from 'sharp';

describe('gen-og', () => {
  it('renders an SVG that includes the school name and a hex fill', () => {
    const svg = renderOgSvg({ name: 'Free Stuff @ Dartmouth', accentHex: '#00693e' });
    expect(svg).toContain('Free Stuff @ Dartmouth');
    expect(svg).toContain('#00693e');
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
  });

  it('sharp rasterises the SVG to a 1200x630 PNG', async () => {
    const svg = renderOgSvg({ name: 'Free Stuff @ Dartmouth', accentHex: '#00693e' });
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const meta = await sharp(png).metadata();
    expect(meta.format).toBe('png');
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
  });

  it('extracts --color-accent (not the -hover/-subtle vars) and converts oklch to hex', () => {
    const css = `:root {
    --color-accent: oklch(39% 0.11 155);
    --color-accent-hover: oklch(35% 0.12 155);
    --color-accent-subtle: oklch(95% 0.02 155);
  }`;
    expect(accentHexFromTokens(css).toLowerCase()).toBe('#005529');
  });

  it('returns a bare hex accent unchanged', () => {
    expect(accentHexFromTokens('--color-accent: #00693e;')).toBe('#00693e');
  });

  it('throws if --color-accent is absent', () => {
    expect(() => accentHexFromTokens(':root { --color-bg: #fff; }')).toThrow();
  });
});
