// src/components/common/skeletons/form-skeleton.jsx
// Skeleton cho form edit/create: nhận `fields` để render block tương ứng.
// Kinds: 'text' | 'textarea' | 'rich' | 'select' | 'switch' | 'media' | 'repeater' | 'two-col'
import { Box, Grid, Skeleton, Stack, Divider } from '@mui/material';

const DEFAULTS = ['text', 'text', 'select', 'rich', 'media'];

function Field({ kind }) {
  const Label = <Skeleton variant="text" width={120} sx={{ fontSize: 12, mb: 0.75 }} />;

  if (kind === 'textarea')
    return <Box>{Label}<Skeleton variant="rectangular" height={96} sx={{ borderRadius: 1 }} /></Box>;

  if (kind === 'rich')
    return (
      <Box>
        {Label}
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
          <Stack direction="row" spacing={0.5} sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={24} height={24} />
            ))}
          </Stack>
          <Box sx={{ p: 1.5 }}>
            <Skeleton variant="text" width="94%" />
            <Skeleton variant="text" width="82%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="48%" />
          </Box>
        </Box>
      </Box>
    );

  if (kind === 'media')
    return (
      <Box>
        {Label}
        <Grid container spacing={1.5}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 6, sm: 3 }}>
              <Skeleton variant="rounded" height={96} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );

  if (kind === 'switch')
    return (
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Skeleton variant="rounded" width={34} height={18} />
        <Stack spacing={0.25}>
          <Skeleton variant="text" width={160} />
          <Skeleton variant="text" width={220} sx={{ fontSize: 11 }} />
        </Stack>
      </Stack>
    );

  if (kind === 'select')
    return (
      <Box>
        {Label}
        <Skeleton variant="rounded" height={38} sx={{ borderRadius: 1 }} />
      </Box>
    );

  if (kind === 'repeater')
    return (
      <Box>
        {Label}
        <Stack spacing={1}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box
              key={i}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.25 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Skeleton variant="rounded" width={28} height={28} />
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" sx={{ fontSize: 11 }} />
                </Stack>
                <Skeleton variant="rounded" width={28} height={28} />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    );

  if (kind === 'two-col')
    return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          {Label}
          <Skeleton variant="rounded" height={38} sx={{ borderRadius: 1 }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Skeleton variant="text" width={120} sx={{ fontSize: 12, mb: 0.75 }} />
          <Skeleton variant="rounded" height={38} sx={{ borderRadius: 1 }} />
        </Grid>
      </Grid>
    );

  // default text input
  return (
    <Box>
      {Label}
      <Skeleton variant="rounded" height={38} sx={{ borderRadius: 1 }} />
    </Box>
  );
}

/**
 * sections: optional array of { title?, fields: Kind[] }. Nếu không truyền, fallback dùng `fields` phẳng.
 */
export function FormSkeleton({ fields, sections, withSidebar = false, withHeader = true }) {
  const list = sections?.length
    ? sections
    : [{ title: null, fields: fields?.length ? fields : DEFAULTS }];

  const main = (
    <Stack divider={<Divider />}>
      {list.map((s, i) => (
        <Box key={i} sx={{ p: { xs: 2, md: 3 } }}>
          {s.title !== null && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Skeleton variant="rounded" width={24} height={24} />
              <Skeleton variant="text" width={180} sx={{ fontSize: 15 }} />
            </Stack>
          )}
          <Stack spacing={2}>
            {s.fields.map((k, j) => (
              <Field key={j} kind={k} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      {withHeader && (
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
            <Stack spacing={0.75}>
              <Skeleton variant="text" width={240} sx={{ fontSize: 22 }} />
              <Skeleton variant="text" width={320} sx={{ fontSize: 13 }} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={88} height={32} />
              <Skeleton variant="rounded" width={112} height={32} />
            </Stack>
          </Stack>
        </Box>
      )}

      {withSidebar ? (
        <Grid container spacing={0}>
          <Grid size={{ xs: 12, md: 8 }} sx={{ borderRight: { md: 1 }, borderColor: 'divider' }}>
            {main}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack divider={<Divider />}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Box key={i} sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Skeleton variant="text" width={140} sx={{ fontSize: 13, mb: 1.5 }} />
                  <Stack spacing={1}>
                    <Skeleton variant="rounded" height={36} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rounded" height={36} sx={{ borderRadius: 1 }} />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      ) : main}
    </Box>
  );
}
