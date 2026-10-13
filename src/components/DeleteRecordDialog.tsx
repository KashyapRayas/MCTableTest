import { Box, Button, Dialog, IconButton, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { tokens } from '../theme'

const buttonSx = { height: 41, px: '20px', borderRadius: '10px', fontSize: 14 }

type Props = {
  open: boolean
  recordName?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteRecordDialog({ open, recordName, onCancel, onConfirm }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-record-title"
      aria-describedby="delete-record-description"
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.6)' } } }}
      PaperProps={{
        sx: {
          bgcolor: tokens.bg,
          backgroundImage: 'none',
          borderRadius: '20px',
          boxShadow: '0px 19px 45px rgba(0,0,0,0.12)',
          p: '24px',
          width: 440,
          m: '16px',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '12px' }}>
        <Typography id="delete-record-title" sx={{ fontSize: 24, fontWeight: 500, lineHeight: 'normal', color: tokens.text }}>
          Delete record?
        </Typography>
        <IconButton onClick={onCancel} aria-label="Close" sx={{ p: 0, color: tokens.text }}>
          <CloseRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      <Typography id="delete-record-description" sx={{ fontSize: 14, lineHeight: 1.5, color: tokens.textSubtle }}>
        {recordName ? (
          <>
            <Box component="span" sx={{ color: tokens.text, fontWeight: 500 }}>{recordName}</Box> will be permanently
            removed from Custom #3.
          </>
        ) : (
          'This record will be permanently removed from Custom #3.'
        )}{' '}
        This can't be undone.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', mt: '24px' }}>
        <Button onClick={onCancel} sx={{ ...buttonSx, color: tokens.text }}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={onConfirm}
          autoFocus
          sx={{
            ...buttonSx,
            color: tokens.danger,
            borderColor: tokens.danger,
            '&:hover': { borderColor: tokens.danger, bgcolor: 'rgba(255,97,97,0.12)' },
          }}
        >
          Delete
        </Button>
      </Box>
    </Dialog>
  )
}
