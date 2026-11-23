import IconButton from '@mui/material/IconButton';
import MenuOutlined from '@mui/icons-material/MenuOutlined';

// ----------------------------------------------------------------------

export function MenuButton({ sx, ...other }) {
  return (
    <IconButton sx={sx} {...other}>
      <MenuOutlined />
    </IconButton>
  );
}
