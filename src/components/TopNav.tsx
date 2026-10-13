import { Box, ButtonBase, Typography } from '@mui/material'
import { tokens } from '../theme'
import projectImage from '../assets/project-image.png'
import shieldIcon from '../assets/shield.svg'
import houseIcon from '../assets/house.svg'
import settingsIcon from '../assets/settings.svg'
import updatesIcon from '../assets/updates.svg'
import myTasksIcon from '../assets/my-tasks.svg'
import circlesThreePlusIcon from '../assets/circles-three-plus.svg'
import caretDownIcon from '../assets/caret-down.svg'
import customPagesIcon from '../assets/custom-pages.svg'
// The Figma SVG export for this icon has corrupt path data, so it uses a 2x PNG export instead.
import projectMediaIcon from '../assets/project-media@2x.png'
import pushPinIcon from '../assets/push-pin.svg'
import sparkleIcon from '../assets/sparkle.svg'
import shieldOutlineIcon from '../assets/shield-outline.svg'
import usersThreeIcon from '../assets/users-three.svg'
import bellIcon from '../assets/bell.svg'
import caretDownLgIcon from '../assets/caret-down-lg.svg'

const Icon = ({ src, size }: { src: string; size: number }) => (
  <Box sx={{ width: size, height: size, flexShrink: 0, display: 'flex' }}>
    <img src={src} alt="" width={size} height={size} style={{ display: 'block' }} />
  </Box>
)

type Tab = { label: string; icon: string; active?: boolean; caret?: boolean; maxWidth?: number }

const tabs: Tab[] = [
  { label: 'Updates', icon: updatesIcon },
  { label: 'Tasks', icon: myTasksIcon },
  { label: 'Trackable Pages', icon: circlesThreePlusIcon, caret: true },
  { label: 'Custom Pages', icon: customPagesIcon, active: true },
  { label: 'Project Media', icon: projectMediaIcon },
  { label: 'Custom Page 1', icon: pushPinIcon, maxWidth: 150 },
]

const navItemSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  px: '12px',
  py: '10px',
  height: '100%',
  flexShrink: 0,
}

const iconButtonSx = {
  p: '8px',
  borderRadius: '5px',
  border: `1px solid ${tokens.primary}`,
}

export default function TopNav() {
  return (
    <Box
      component="nav"
      sx={{
        bgcolor: tokens.surface,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        px: '24px',
        width: '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', height: 55, pr: '12px', width: 200 }}>
          <Box
            component="img"
            src={projectImage}
            alt=""
            sx={{ width: 36, height: 36, borderRadius: '4.593px', objectFit: 'cover', bgcolor: '#c4c4c4', flexShrink: 0 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 14, fontWeight: 500, lineHeight: 'normal', color: tokens.text }}>
              Movie Colab Test Project
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Icon src={shieldIcon} size={14} />
              <Typography sx={{ fontSize: 12, lineHeight: 'normal', color: tokens.textSubtle }}>Admin</Typography>
            </Box>
          </Box>
        </Box>
        <ButtonBase sx={{ ...navItemSx, height: 55 }} aria-label="Home">
          <Icon src={houseIcon} size={16} />
        </ButtonBase>
        <ButtonBase sx={{ ...navItemSx, height: 55 }} aria-label="Settings">
          <Icon src={settingsIcon} size={16} />
        </ButtonBase>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, minWidth: 0, alignSelf: 'stretch', overflow: 'hidden' }}>
        {tabs.map((t) => (
          <ButtonBase
            key={t.label}
            sx={{ ...navItemSx, maxWidth: t.maxWidth, bgcolor: t.active ? tokens.bg : 'transparent' }}
          >
            <Icon src={t.icon} size={16} />
            <Typography
              noWrap
              sx={{ fontSize: 12, lineHeight: 'normal', color: t.active ? tokens.text : tokens.textNav }}
            >
              {t.label}
            </Typography>
            {t.caret && <Icon src={caretDownIcon} size={14} />}
          </ButtonBase>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <ButtonBase
          aria-label="AI assistant"
          sx={{ p: '8px', borderRadius: '5px', backgroundImage: `linear-gradient(to left, ${tokens.primary}, ${tokens.primaryLight})` }}
        >
          <Icon src={sparkleIcon} size={18} />
        </ButtonBase>
        <ButtonBase aria-label="Permissions" sx={iconButtonSx}>
          <Icon src={shieldOutlineIcon} size={18} />
        </ButtonBase>
        <ButtonBase aria-label="Team" sx={iconButtonSx}>
          <Icon src={usersThreeIcon} size={18} />
        </ButtonBase>
        <ButtonBase
          aria-label="Notifications"
          sx={{ bgcolor: tokens.primary, borderRadius: '5px', px: '6px', py: '4px', gap: '6px', alignSelf: 'stretch' }}
        >
          <Box sx={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: 'normal', color: '#ececec' }}>24</Typography>
          </Box>
          <Icon src={bellIcon} size={22} />
        </ButtonBase>
        <ButtonBase aria-label="Account" sx={{ display: 'flex', alignItems: 'center', gap: '8px', px: '6px', py: '4px', borderRadius: '5px' }}>
          <Box sx={{ border: `1px solid ${tokens.avatarBorder}`, borderRadius: '20px', display: 'flex' }}>
            <Box
              sx={{
                bgcolor: tokens.primary,
                borderRadius: '20px',
                width: 29,
                height: 29,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 500, lineHeight: 'normal', color: '#000' }}>SS</Typography>
            </Box>
          </Box>
          <Icon src={caretDownLgIcon} size={18} />
        </ButtonBase>
      </Box>
    </Box>
  )
}
