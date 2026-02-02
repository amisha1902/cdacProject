import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

export default function ImageAvatar({ name = 'User', imageUrl = null, size = 40 }) {
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  };

  const sx = { width: size, height: size, bgcolor: '#bdbdbd', fontSize: size * 0.45 };

  return (
    <Link to="/profile">
      <Stack direction="row" spacing={2}>
        {imageUrl ? (
          <Avatar alt={name} src={imageUrl} sx={sx} />
        ) : (
          <Avatar sx={sx}>{getInitials(name)}</Avatar>
        )}
      </Stack>
    </Link>
  );
}