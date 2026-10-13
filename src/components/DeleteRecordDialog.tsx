import { Box, Button, Dialog, Typography } from '@mui/material'
import { tokens } from '../theme'
import trashRedIcon from '../assets/trash-simple-red.svg'
import trashIcon from '../assets/trash-simple.svg'
import cancelIcon from '../assets/cancel.svg'

const Icon = ({ src, size }: { src: string; size: number }) => (
  <Box sx={{ width: size, height: size, display: 'flex', flexShrink: 0 }}>
    <img src={src} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
  </Box>
)

const buttonSx = {
  px: '20px',
  py: '10px',
  gap: '10px',
  minWidth: 0,
  borderRadius: '10px',
  fontSize: 14,
  lineHeight: 'normal',
  color: tokens.text,
  '& .MuiButton-startIcon': { m: 0 },
}

type Props = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteRecordDialog({ open, onCancel, onConfirm }: Props) {
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
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          p: '24px',
          width: 500,
          m: '16px',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', pb: '16px', width: '100%' }}>
        <Icon src={trashRedIcon} size={24} />
        <Typography
          id="delete-record-title"
          component="h2"
          sx={{ fontSize: 24, fontWeight: 500, lineHeight: 'normal', color: tokens.text, whiteSpace: 'nowrap' }}
        >
          Delete Confirmation
        </Typography>
      </Box>

      <Typography
        id="delete-record-description"
        sx={{ width: '100%', fontSize: 14, lineHeight: 'normal', textAlign: 'center', color: tokens.text }}
      >
        Are you sure you want to delete this row? This action can’t be undone.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pt: '16px', width: '100%' }}>
        <Button
          onClick={onCancel}
          startIcon={<Icon src={cancelIcon} size={18} />}
          sx={{
            ...buttonSx,
            border: `2px solid ${tokens.primary}`,
            '&:hover': { bgcolor: 'rgba(108,101,217,0.16)' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          startIcon={<Icon src={trashIcon} size={18} />}
          sx={{ ...buttonSx, fontWeight: 500, bgcolor: tokens.danger, '&:hover': { bgcolor: tokens.dangerHover } }}
        >
          Delete row
        </Button>
      </Box>
    </Dialog>
  )
}
