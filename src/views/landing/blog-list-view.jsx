'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { landingTokens } from 'src/theme/landing';
import { fUnixToDateVN } from 'src/utils/format-time';
import { useGetBlogList } from 'src/actions/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';

const DEFAULT_CAT = 'Tất cả';

export function BlogListView() {
  const [cat, setCat] = useState(DEFAULT_CAT);

  // shortcut: filter theo tên chuyên mục (BE chưa trả slug mapping); upgrade khi có category_slug picker.
  const { articles, featured, categories: apiCategories, loading } = useGetBlogList({
    category_slug: cat === DEFAULT_CAT ? '' : cat,
    limit: 24,
  });

  const categoryChips = useMemo(
    () => [DEFAULT_CAT, ...(apiCategories || []).map((c) => c.name).filter(Boolean)],
    [apiCategories]
  );

  // Hero lấy từ featured[0] nếu có, fallback articles[0].
  const hero = useMemo(() => {
    const src = featured?.[0] ?? articles?.[0] ?? null;
    if (!src) return null;
    return {
      id: src.id,
      slug: src.slug,
      title: src.title,
      excerpt: src.excerpt,
      category: src.category?.name ?? 'Tin tức',
      date: src.published_at ? fUnixToDateVN(src.published_at) : null,
      thumbnail_url: src.thumbnail?.url ?? null,
    };
  }, [featured, articles]);

  const rest = useMemo(
    () => (articles || [])
      .filter((a) => a.id !== hero?.id)
      .map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category?.name ?? 'Tin tức',
        date: a.published_at ? fUnixToDateVN(a.published_at) : null,
        thumbnail_url: a.thumbnail?.url ?? null,
      })),
    [articles, hero]
  );

  return (
    <>
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 5, md: 8 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            TIN TỨC & CẨM NANG
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 56 }, fontWeight: 500, mt: 1, lineHeight: 1.1 }}>
            Cảm hứng mỗi tuần
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 5 }}>
          {categoryChips.map((c) => (
            <Chip
              key={c}
              label={c}
              onClick={() => setCat(c)}
              variant={c === cat ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 0,
                borderColor: landingTokens.HAIRLINE,
                bgcolor: c === cat ? landingTokens.INK : 'transparent',
                color: c === cat ? landingTokens.GOLD : landingTokens.INK,
                '&:hover': { bgcolor: c === cat ? landingTokens.INK : landingTokens.NEUTRAL },
              }}
            />
          ))}
        </Stack>

        {hero && (
          <Box
            component={Link}
            href={`/blog/${hero.slug ?? hero.id}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
              gap: { xs: 3, md: 5 },
              mb: { xs: 6, md: 10 },
              textDecoration: 'none',
              color: 'inherit',
              '&:hover img': { transform: 'scale(1.02)' },
            }}
          >
            <Box sx={{ aspectRatio: { xs: '4 / 3', md: '3 / 2' }, overflow: 'hidden' }}>
              {hero.thumbnail_url ? (
                <Box
                  component="img"
                  src={hero.thumbnail_url}
                  alt={hero.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms ease' }}
                />
              ) : (
                <Wireframe label={`Bài viết ${hero.id}`} />
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.2em' }}>
                {hero.category ?? 'Tin tức'}
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 26, md: 38 }, fontWeight: 500, lineHeight: 1.2, mt: 1, mb: 2 }}>
                {hero.title}
              </Typography>
              <Typography sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75, mb: 2 }}>
                {hero.excerpt}
              </Typography>
              <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.1em' }}>
                {hero.date ?? '2026-01-20'}
              </Typography>
            </Box>
          </Box>
        )}

        <Grid container spacing={{ xs: 3, md: 5 }}>
          {rest.map((b) => (
            <Grid key={b.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                component={Link}
                href={`/blog/${b.slug ?? b.id}`}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover img': { transform: 'scale(1.03)' },
                }}
              >
                <Box sx={{ aspectRatio: '3 / 2', mb: 2.5, overflow: 'hidden' }}>
                  {b.thumbnail_url ? (
                    <Box
                      component="img"
                      src={b.thumbnail_url}
                      alt={b.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms ease' }}
                    />
                  ) : (
                    <Wireframe label={`Bài viết ${b.id}`} />
                  )}
                </Box>
                <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.2em' }}>
                  {b.category ?? 'Tin tức'}
                </Typography>
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 22, fontWeight: 500, lineHeight: 1.25, mt: 1, mb: 1.5 }}>
                  {b.title}
                </Typography>
                <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7 }}>
                  {b.excerpt}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
