import { Box, Button, Typography } from '@mui/material'
import { tokens } from '../theme'
import arrowHeadLeftIcon from '../assets/arrow-head-left.svg'
import checkSquareIcon from '../assets/check-square.svg'
import pencilIcon from '../assets/pencil-simple.svg'
import addIcon from '../assets/add.svg'

const ghostButtonSx = {
  color: tokens.text,
  borderRadius: '10px',
  py: '10px',
  minWidth: 0,
  '& .MuiButton-startIcon': { m: 0 },
}

export default function PageHeader({ onNewRecord }: { onNewRecord: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44, width: '100%', flexShrink: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Typography sx={{ fontSize: 20, lineHeight: 'normal', color: tokens.textMuted }}>Custom Pages</Typography>
        <Box sx={{ width: 14, height: 14, display: 'flex', transform: 'rotate(180deg)' }}>
          <img src={arrowHeadLeftIcon} alt="" style={{ display: 'block' }} />
        </Box>
        <Typography sx={{ fontSize: 20, fontWeight: 500, lineHeight: 'normal', color: tokens.text }}>Custom #3</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Button
          sx={{ ...ghostButtonSx, px: '12px', gap: '8px' }}
          startIcon={<Box sx={{ width: 22, height: 22, display: 'flex' }}><img src={checkSquareIcon} alt="" /></Box>}
        >
          Multi-Select
        </Button>
        <Button
          sx={{ ...ghostButtonSx, px: '20px', gap: '10px' }}
          startIcon={
            <Box sx={{ width: 20, height: 20, display: 'flex' }}>
              <img src={pencilIcon} alt="" style={{ width: '100%', height: '100%' }} />
            </Box>
          }
        >
          Edit Page
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={onNewRecord}
          sx={{ ...ghostButtonSx, px: '20px', gap: '8px', alignSelf: 'stretch', bgcolor: tokens.primary }}
          startIcon={<Box sx={{ width: 18, height: 18, display: 'flex' }}><img src={addIcon} alt="" /></Box>}
        >
          New Record
        </Button>
      </Box>
    </Box>
  )
}
