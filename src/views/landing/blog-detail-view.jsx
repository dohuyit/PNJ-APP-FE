'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import LinkIcon from '@mui/icons-material/Link';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

import { fUnixToDateVN } from 'src/utils/format-time';

import { landingTokens } from 'src/theme/landing';
import { useGetBlogDetail } from 'src/actions/landing';

import Wireframe from 'src/sections/landing/components/Wireframe';

export function BlogDetailView({ params }) {
  const { slug } = params;
  const { article, related, loading } = useGetBlogDetail(slug);

  if (!article) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography color="text.secondary">{loading ? 'Đang tải…' : 'Không tìm thấy bài viết.'}</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 5 } }}>
        <Breadcrumbs separator="/" sx={{ fontSize: 13, color: landingTokens.INK_MUTED, mb: 3 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>
          <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
          <Typography variant="caption" sx={{ color: landingTokens.INK }}>{article.category?.name ?? 'Bài viết'}</Typography>
        </Breadcrumbs>
      </Container>

      <Container maxWidth="md" sx={{ pb: 5 }}>
        <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
          {(article.category?.name ?? 'CẨM NANG').toUpperCase()}
        </Typography>
        <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 32, md: 52 }, fontWeight: 500, lineHeight: 1.1, my: 2 }}>
          {article.title}
        </Typography>
        <Stack direction="row" spacing={2} divider={<Box sx={{ width: 1, height: 14, bgcolor: landingTokens.HAIRLINE }} />} sx={{ color: landingTokens.INK_MUTED, fontSize: 13 }}>
          <span>{article.author?.name ?? 'PNJ Editorial'}</span>
          {article.published_at && <span>{fUnixToDateVN(article.published_at)}</span>}
          <span>6 phút đọc</span>
        </Stack>
      </Container>

      <Box sx={{ aspectRatio: { xs: '4 / 3', md: '21 / 9' }, mb: { xs: 5, md: 8 }, overflow: 'hidden' }}>
        {article.thumbnail?.url ? (
          <Box component="img" src={article.thumbnail.url} alt={article.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Wireframe label={`Ảnh hero · ${article.title}`} />
        )}
      </Box>

      <Container maxWidth="md">
        {article.excerpt && (
          <Typography sx={{ fontSize: 20, fontStyle: 'italic', color: landingTokens.INK_MUTED, borderLeft: `2px solid ${landingTokens.GOLD}`, pl: 3, mb: 3 }}>
            {article.excerpt}
          </Typography>
        )}

        {article.content_html ? (
          <Box
            sx={{ fontSize: 17, lineHeight: 1.9, '& h2': { fontFamily: landingTokens.FONT_SANS, fontSize: 28, fontWeight: 500, mt: 4 }, '& p': { my: 2 } }}
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />
        ) : null}

        <Divider sx={{ my: 5 }} />

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 8 }}>
          <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>Chia sẻ:</Typography>
          {[FacebookIcon, TwitterIcon, LinkIcon].map((Icon, i) => (
            <Box
              key={i}
              component="button"
              sx={{
                width: 40,
                height: 40,
                border: `1px solid ${landingTokens.HAIRLINE}`,
                bgcolor: 'transparent',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                color: landingTokens.INK_MUTED,
                '&:hover': { borderColor: landingTokens.PRIMARY, color: landingTokens.PRIMARY },
              }}
            >
              <Icon fontSize="small" />
            </Box>
          ))}
        </Stack>
      </Container>

      {related.length > 0 && (
        <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 6, md: 10 } }}>
          <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              BÀI VIẾT LIÊN QUAN
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 24, md: 36 }, mt: 1, mb: 4 }}>
              Đọc thêm từ cẩm nang
            </Typography>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {related.map((r) => (
                <Grid key={r.id} size={{ xs: 12, md: 4 }}>
                  <Box
                    component={Link}
                    href={`/blog/${r.slug ?? r.id}`}
                    sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover img': { transform: 'scale(1.03)' } }}
                  >
                    <Box sx={{ aspectRatio: '3 / 2', mb: 2, overflow: 'hidden' }}>
                      {r.thumbnail?.url ? (
                        <Box component="img" src={r.thumbnail.url} alt={r.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms ease' }} />
                      ) : (
                        <Wireframe label={`Bài viết ${r.id}`} />
                      )}
                    </Box>
                    <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.18em' }}>
                      {r.category?.name ?? 'Cẩm nang'}
                    </Typography>
                    <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 20, fontWeight: 500, mt: 0.5, mb: 1 }}>
                      {r.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>{r.excerpt}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
}
