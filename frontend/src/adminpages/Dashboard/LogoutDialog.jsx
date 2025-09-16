import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import AlertAnimation from '../common/AlertAnimation';
import GradientButton from '../common/GradientButton';
import OutlinedButton from '../common/OutlinedButton';

const LogoutDialog = ({ open, onClose, onConfirm, text, subText }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { maxWidth: 500, padding: '32px 16px', borderRadius: '16px' },
      }}
    >
      <DialogContent sx={{ p: 0, mb: '1rem', textAlign: 'center' }}>
        <AlertAnimation />
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            fontWeight: 600,
            fontSize: '1.5rem',
            textAlign: 'center',
            color: '#000',
            pb: 0,
          }}
        >
          {text}
        </DialogTitle>

        {subText && (
          <DialogContentText
            id="logout-dialog-description"
            sx={{
              fontSize: '14px',
              color: '#787878',
              textAlign: 'center',
              mt: '0.5rem',
            }}
          >
            {subText}
          </DialogContentText>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          mx: '3rem',
          gap: '0.7rem',
        }}
      >
        <OutlinedButton width={'40%'} onClick={onClose}>
          Cancel
        </OutlinedButton>
        <GradientButton width={'40%'} onClick={onConfirm}>
          Yes
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
