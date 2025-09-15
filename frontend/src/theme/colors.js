// Theme colors for consistent styling across the application
export const colors = {
  primary: {
    main: '#369D9C',
    secondary: '#28814D',
    gradient: 'linear-gradient(102deg, #369D9C 0%, #28814D 100%)',
    border: '#77BCBB',
    light: '#96CDCC',
    lightest: '#F6FFF7'
  },
  background: {
    main: '#fafafa',
    white: '#ffffff',
    gray: '#f5f5f5'
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    tertiary: '#999999',
    disabled: '#B7B7B7'
  },
  border: {
    light: '#E4E4E4',
    medium: '#DBDBDB',
    dark: '#EFEFEF'
  },
  error: {
    main: '#FF3A3A',
    light: '#F27878'
  },
  status: {
    success: '#28814D',
    warning: '#FF9800',
    info: '#2196F3'
  }
};

// Font families
export const fonts = {
  primary: 'Inter, sans-serif',
  mono: 'monospace'
};

// Common sizes
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
};

export default {
  colors,
  fonts,
  spacing
};
