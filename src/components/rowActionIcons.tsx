import { Box } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { tokens } from '../theme'
import pencilIcon from '../assets/pencil-simple.svg'
import deleteIcon from '../assets/delete.svg'

const SvgAsset = ({ src }: { src: string }) => (
  <Box sx={{ width: 22, height: 22, display: 'flex' }}>
    <img src={src} alt="" style={{ display: 'block' }} />
  </Box>
)

// Edit/Delete come from the Figma frame; Save/Discard aren't in the design,
// so they use MUI icons sized to the same 22px slot.
export const EditIcon = () => <SvgAsset src={pencilIcon} />
export const DeleteIcon = () => <SvgAsset src={deleteIcon} />
export const SaveIcon = () => <CheckRoundedIcon sx={{ fontSize: 22, color: tokens.primaryLight }} />
export const DiscardIcon = () => <CloseRoundedIcon sx={{ fontSize: 22, color: tokens.text }} />
