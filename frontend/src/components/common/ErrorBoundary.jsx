import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 4,
            textAlign: 'center',
            backgroundColor: '#fafafa',
          }}
        >
          <Box
            sx={{
              maxWidth: 600,
              padding: 4,
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              style={{ margin: '0 auto 24px' }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#ff6b6b"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
                stroke="#ff6b6b"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
                stroke="#ff6b6b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <Typography
              variant="h4"
              sx={{
                color: '#333',
                marginBottom: 2,
                fontWeight: 600,
                fontFamily: 'Inter',
              }}
            >
              Oops! Something went wrong
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#666',
                marginBottom: 3,
                lineHeight: 1.6,
                fontFamily: 'Inter',
              }}
            >
              We're sorry, but an unexpected error occurred. Our team has been notified and is working to resolve this issue.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={this.handleGoBack}
                sx={{
                  borderColor: '#369D9C',
                  color: '#369D9C',
                  '&:hover': {
                    borderColor: '#28814D',
                    color: '#28814D',
                  },
                }}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                onClick={this.handleReload}
                sx={{
                  background: 'linear-gradient(102deg, #369D9C 0%, #28814D 100%)',
                  '&:hover': {
                    background: 'linear-gradient(102deg, #28814D 0%, #369D9C 100%)',
                  },
                }}
              >
                Reload Page
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  marginTop: 3,
                  padding: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  textAlign: 'left',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    display: 'block',
                    marginBottom: 1,
                  }}
                >
                  Error Details (Development Only):
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#d32f2f',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
