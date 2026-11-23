'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';
import { useGetFaq } from 'src/actions/landing';

const GROUP_LABEL = {
  product_general: 'Sản phẩm',
  payment: 'Thanh toán',
  shipping: 'Giao hàng',
  warranty: 'Đổi trả & bảo hành',
};

export function FaqView() {
  const [q, setQ] = useState('');
  const { groups } = useGetFaq(q);

  const filtered = useMemo(
    () => (groups || []).map((g) => ({
      topic: GROUP_LABEL[g.group] ?? g.group ?? 'Khác',
      items: (g.items || []).map((it) => ({ q: it.question, a: it.answer_html })),
    })),
    [groups]
  );

  return (
    <>
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <HelpOutlineOutlinedIcon sx={{ fontSize: 48, color: landingTokens.GOLD, mb: 2 }} />
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            CÂU HỎI THƯỜNG GẶP
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 32, md: 48 }, fontWeight: 500, mt: 1, lineHeight: 1.15, mb: 3 }}>
            Chúng tôi sẵn sàng<br />hỗ trợ bạn
          </Typography>
          <TextField
            placeholder="Tìm câu hỏi..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            fullWidth
            sx={{ ...sxSharpInput, maxWidth: 520, mx: 'auto' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: landingTokens.GOLD_DARK }} />
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        {filtered.length > 0 ? (
          <Stack spacing={5}>
            {filtered.map((t) => (
              <Box key={t.topic}>
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, fontWeight: 500, mb: 2 }}>
                  {t.topic}
                </Typography>
                <Box>
                  {t.items.map((it, i) => (
                    <Accordion
                      key={i}
                      elevation={0}
                      disableGutters
                      square
                      sx={{
                        bgcolor: 'transparent',
                        borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, py: 1 }}>
                        <Typography sx={{ fontWeight: 600 }}>{it.q}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 0, pb: 2.5 }}>
                        <Box
                          sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.8, '& p': { m: 0 }, '& strong': { color: landingTokens.INK } }}
                          dangerouslySetInnerHTML={{ __html: it.a }}
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ color: landingTokens.INK_MUTED }}>Không tìm thấy câu hỏi phù hợp.</Typography>
          </Box>
        )}

        <Box sx={{ mt: 10, p: { xs: 4, md: 6 }, textAlign: 'center', bgcolor: landingTokens.INK, color: '#FBF7F2' }}>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 32 }, color: landingTokens.GOLD, mb: 2 }}>
            Vẫn cần hỗ trợ?
          </Typography>
          <Typography sx={{ color: '#E8DFD4', opacity: 0.85, mb: 3, maxWidth: 480, mx: 'auto' }}>
            Đội ngũ tư vấn 24/7 sẵn sàng giải đáp mọi thắc mắc qua hotline hoặc email.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={Link} href="/contact" variant="contained" size="large" sx={sxSharpBtnContained}>
              Liên hệ ngay
            </Button>
            <Button
              component="a"
              href="tel:19005457"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 600, color: '#FBF7F2', borderColor: '#FBF7F2', '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD } }}
            >
              Gọi 1900 54 54 57
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
