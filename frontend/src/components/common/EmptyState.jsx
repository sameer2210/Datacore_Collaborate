import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const EmptyState = ({
  title = "No data available",
  description = "There's nothing to show here yet.",
  actionText,
  onAction,
  icon: CustomIcon,
  showDefaultIcon = true
}) => {
  const DefaultIcon = () => (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      style={{ margin: '0 auto 24px', opacity: 0.5 }}
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="#E0E0E0"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M3 8h18"
        stroke="#E0E0E0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 12h8"
        stroke="#E0E0E0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 16h5"
        stroke="#E0E0E0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        textAlign: 'center',
        minHeight: '200px',
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #E4E4E4',
      }}
    >
      {CustomIcon ? <CustomIcon /> : (showDefaultIcon && <DefaultIcon />)}
      
      <Typography
        variant="h6"
        sx={{
          color: '#666',
          marginBottom: 1,
          fontWeight: 500,
          fontFamily: 'Inter',
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: '#999',
          marginBottom: actionText ? 3 : 0,
          maxWidth: '300px',
          lineHeight: 1.5,
          fontFamily: 'Inter',
        }}
      >
        {description}
      </Typography>
      
      {actionText && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{
            background: 'linear-gradient(102deg, #369D9C 0%, #28814D 100%)',
            borderRadius: '8px',
            textTransform: 'none',
            fontFamily: 'Inter',
            fontWeight: 500,
            '&:hover': {
              background: 'linear-gradient(102deg, #28814D 0%, #369D9C 100%)',
            },
          }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
