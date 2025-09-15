import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoaderSpinner = ({ 
  size = 40, 
  message = "Loading...", 
  showMessage = true,
  fullScreen = false 
}) => {
  const containerStyles = fullScreen 
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      };

  return (
    <Box sx={containerStyles}>
      <CircularProgress
        size={size}
        sx={{
          color: '#369D9C',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      {showMessage && (
        <Typography
          variant="body2"
          sx={{
            marginTop: 2,
            color: '#666',
            fontFamily: 'Inter',
            fontSize: '14px',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoaderSpinner;
