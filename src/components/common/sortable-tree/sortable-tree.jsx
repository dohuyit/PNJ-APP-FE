// src/components/common/sortable-tree/sortable-tree.jsx — flat-visualised sortable tree using dnd-kit
'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, Box, IconButton, Paper, Stack, Typography, Chip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

function Row({ item, depth, onEdit, onDelete, onAddChild, selected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      onClick={() => onSelect?.(item)}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        p: 1.25,
        mb: 0.75,
        ml: depth * 3,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: selected ? 'primary.lighter' : 'common.white',
        borderColor: selected ? 'primary.main' : 'grey.300',
        borderWidth: selected ? 2 : 1,
        opacity: isDragging ? 0.4 : 1,
        cursor: onSelect ? 'pointer' : 'default',
        '&:hover': { bgcolor: selected ? 'primary.lighter' : 'grey.50' },
      }}
    >
      <IconButton
        size="small"
        {...attributes}
        {...listeners}
        sx={{ cursor: 'grab', color: 'text.disabled', '&:active': { cursor: 'grabbing' } }}
      >
        <Iconify icon="solar:hamburger-menu-linear" width={16} />
      </IconButton>
      {item.icon && <Avatar src={item.icon} sx={{ width: 28, height: 28 }} variant="rounded" />}
      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {item.name ?? item.label}
        </Typography>
        {item.slug && (
          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontFamily: 'monospace' }}>
            /{item.slug}
          </Typography>
        )}
      </Stack>
      {item.badge && <Chip label={item.badge} size="small" color="error" sx={{ height: 20, fontSize: 10 }} />}
      {item.count != null && (
        <Chip
          label={item.count}
          size="small"
          variant="outlined"
          sx={{ height: 22, minWidth: 40 }}
        />
      )}
      {onAddChild && (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onAddChild(item); }}
          sx={{ color: 'primary.main' }}
          title="Thêm danh mục con"
        >
          <Iconify icon="solar:add-circle-linear" width={16} />
        </IconButton>
      )}
      {onEdit && (
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
          <Iconify icon="solar:pen-linear" width={16} />
        </IconButton>
      )}
      {onDelete && (
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(item); }} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-linear" width={16} />
        </IconButton>
      )}
    </Paper>
  );
}

function flatten(items, depth = 0, out = []) {
  items.forEach((item) => {
    out.push({ ...item, _depth: depth });
    if (item.children?.length) flatten(item.children, depth + 1, out);
  });
  return out;
}

export function SortableTree({ items, onChange, onEdit, onDelete, onAddChild, selectedId, onSelect, sx }) {
  const flat = flatten(items ?? []);
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = flat.findIndex((i) => i.id === active.id);
    const newIdx = flat.findIndex((i) => i.id === over.id);
    onChange?.(arrayMove(flat, oldIdx, newIdx).map(({ _depth, ...r }) => r));
  };

  if (flat.length === 0) {
    return (
      <Box sx={sx}>
        <EmptyContent filled title="Chưa có mục nào" sx={{ py: 6 }} />
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={flat.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {flat.map((i) => (
            <Row
              key={i.id}
              item={i}
              depth={i._depth}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              selected={selectedId === i.id}
              onSelect={onSelect}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
}
