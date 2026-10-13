import { Box } from '@mui/material'
import TopNav from './components/TopNav'
import TableVariant from './variants/TableVariant'
import { tokens } from './theme'

export default function App() {
  return (
    <Box sx={{ bgcolor: tokens.bg, display: 'flex', flexDirection: 'column', gap: '16px', height: '100vh' }}>
      <TopNav />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, px: '24px', pb: '24px' }}>
        <TableVariant />
      </Box>
    </Box>
  )
}
