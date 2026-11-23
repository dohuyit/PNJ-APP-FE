// src/components/common/rich-text-editor/rich-text-editor.jsx — TipTap editor with basic toolbar
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Box, Divider, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';

const TOOLBAR = [
  { icon: 'solar:text-bold-linear', cmd: (e) => e.chain().focus().toggleBold().run(), active: (e) => e.isActive('bold'), label: 'Bold' },
  { icon: 'solar:text-italic-linear', cmd: (e) => e.chain().focus().toggleItalic().run(), active: (e) => e.isActive('italic'), label: 'Italic' },
  { icon: 'solar:text-underline-linear', cmd: (e) => e.chain().focus().toggleUnderline().run(), active: (e) => e.isActive('underline'), label: 'Underline' },
  { icon: 'solar:list-linear', cmd: (e) => e.chain().focus().toggleBulletList().run(), active: (e) => e.isActive('bulletList'), label: 'Bullet list' },
  { icon: 'solar:list-check-linear', cmd: (e) => e.chain().focus().toggleOrderedList().run(), active: (e) => e.isActive('orderedList'), label: 'Numbered list' },
  { icon: 'solar:quote-up-linear', cmd: (e) => e.chain().focus().toggleBlockquote().run(), active: (e) => e.isActive('blockquote'), label: 'Quote' },
];

export function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung...', minHeight = 220, sx }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value ?? '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: { attributes: { 'data-placeholder': placeholder } },
  });

  if (!editor) return null;

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', ...sx }}>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ p: 1, bgcolor: 'grey.100', borderBottom: 1, borderColor: 'grey.300' }}
      >
        {TOOLBAR.map((t) => (
          <Tooltip key={t.label} title={t.label}>
            <IconButton
              size="small"
              onClick={() => t.cmd(editor)}
              color={t.active(editor) ? 'primary' : 'default'}
            >
              <Iconify icon={t.icon} width={16} />
            </IconButton>
          </Tooltip>
        ))}
        <Divider orientation="vertical" flexItem />
        <Tooltip title="Thêm link">
          <IconButton
            size="small"
            onClick={() => {
              const url = prompt('URL:');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
          >
            <Iconify icon="solar:link-linear" width={16} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Box
        sx={{
          p: 2,
          minHeight,
          '& .ProseMirror': {
            outline: 'none',
            minHeight: minHeight - 32,
            '&:empty::before': {
              content: 'attr(data-placeholder)',
              color: 'text.disabled',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}
