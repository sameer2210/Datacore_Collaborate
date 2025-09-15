import React from 'react';
import { Box, Skeleton } from '@mui/material';

const SkeletonCard = ({ 
  width = '200px', 
  height = '150px',
  showTitle = true,
  showSubtitle = true,
  borderRadius = '10px'
}) => {
  return (
    <Box
      sx={{
        width,
        height,
        backgroundColor: '#fff',
        border: '1px solid #E4E4E4',
        borderRadius,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {showTitle && (
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          sx={{ backgroundColor: '#f0f0f0' }}
        />
      )}
      
      <Skeleton
        variant="rectangular"
        width="100%"
        height="60px"
        sx={{ 
          backgroundColor: '#f0f0f0',
          borderRadius: '6px'
        }}
      />
      
      {showSubtitle && (
        <Skeleton
          variant="text"
          width="60%"
          height={16}
          sx={{ backgroundColor: '#f0f0f0' }}
        />
      )}
    </Box>
  );
};

export default SkeletonCard;
