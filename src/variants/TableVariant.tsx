import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import {
  Box,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material'
import PageHeader from '../components/PageHeader'
import DeleteRecordDialog from '../components/DeleteRecordDialog'
import { DeleteIcon, DiscardIcon, EditIcon, SaveIcon } from '../components/rowActionIcons'
import { columns, compareRows, emptyRow, initialRows, touch, type ColumnKey, type RecordRow, type SortOrder } from '../data'
import { tokens } from '../theme'
import arrowDownIcon from '../assets/arrow-down.svg'

const ACTIONS_WIDTH = 80
const MIN_COL_WIDTH = 60

type ColumnWidths = Record<ColumnKey, number>

// A thin line on the column's right edge; the wider transparent box is the drag target.
const ResizeHandle = ({ onPointerDown }: { onPointerDown: (e: PointerEvent) => void }) => (
  <Box
    role="separator"
    aria-orientation="vertical"
    onPointerDown={onPointerDown}
    onClick={(e) => e.stopPropagation()}
    sx={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: 9,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      cursor: 'col-resize',
      touchAction: 'none',
      zIndex: 1,
      '&::after': { content: '""', width: '1px', height: 20, bgcolor: tokens.textMuted, transition: 'background-color 120ms' },
      '&:hover::after, &.resizing::after': { bgcolor: tokens.textSubtle },
    }}
  />
)

const headCellSx = {
  height: 44,
  px: '10px',
  py: 0,
  fontSize: 14,
  lineHeight: 'normal',
  color: tokens.textMuted,
  borderBottom: `1px solid ${tokens.border}`,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const bodyCellSx = {
  p: '10px',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 'normal',
  color: tokens.text,
  border: `1px solid ${tokens.border}`,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

// The Figma ArrowDown, drawn as a mask so it can take the label's colour.
const SortArrow = ({ className }: { className?: string }) => (
  <Box
    className={className}
    sx={{
      width: 18,
      height: 18,
      flexShrink: 0,
      bgcolor: 'currentColor',
      // Quoted: Vite inlines small SVGs as data URIs, which break an unquoted url().
      mask: `url("${arrowDownIcon}") center / contain no-repeat`,
      WebkitMask: `url("${arrowDownIcon}") center / contain no-repeat`,
    }}
  />
)

// The design's down arrow reads as "ascending" (values grow down the column),
// so asc points down and desc flips it up.
const sortLabelSx = {
  width: '100%',
  gap: '6px',
  color: tokens.textMuted,
  '& .MuiTableSortLabel-icon': { m: 0, opacity: 0, color: tokens.textMuted, transform: 'none' },
  '&:hover, &:focus-visible': { color: tokens.textSubtle },
  '&:hover .MuiTableSortLabel-icon, &:focus-visible .MuiTableSortLabel-icon': { opacity: 1 },
  '&.Mui-active': { color: tokens.text },
  '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1, color: tokens.textMuted },
  '& .MuiTableSortLabel-iconDirectionDesc': { transform: 'rotate(180deg)' },
}

const actionButtonSx = { p: 0, borderRadius: '4px' }

type Editing = { id: number; draft: RecordRow; isNew: boolean }

export default function TableVariant() {
  const [rows, setRows] = useState<RecordRow[]>(initialRows)
  const [editing, setEditing] = useState<Editing | null>(null)
  const [sort, setSort] = useState<{ key: ColumnKey; order: SortOrder } | null>(null)
  // null until the first resize: columns share the width evenly, then switch to fixed px widths.
  const [widths, setWidths] = useState<ColumnWidths | null>(null)
  const headCells = useRef<Partial<Record<ColumnKey, HTMLTableCellElement | null>>>({})
  // Kept separate from `open` so the row is still known while the dialog fades out.
  const [pendingDelete, setPendingDelete] = useState<RecordRow | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // A new record that was never saved shouldn't linger once editing moves elsewhere.
  const withoutUnsavedNew = (rs: RecordRow[]) => (editing?.isNew ? rs.filter((r) => r.id !== editing.id) : rs)

  const startEdit = (row: RecordRow) => {
    setRows(withoutUnsavedNew)
    setEditing({ id: row.id, draft: { ...row }, isNew: false })
  }

  const discard = () => {
    setRows(withoutUnsavedNew)
    setEditing(null)
  }

  const save = () => {
    if (!editing) return
    const saved = touch(editing.draft)
    setRows((rs) => rs.map((r) => (r.id === saved.id ? saved : r)))
    setEditing(null)
  }

  const askDelete = (row: RecordRow) => {
    setPendingDelete(row)
    setDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    setRows((rs) => rs.filter((r) => r.id !== pendingDelete.id))
    setDeleteOpen(false)
  }

  const addRecord = () => {
    const id = Math.max(0, ...rows.map((r) => r.id)) + 1
    const row = emptyRow(id)
    setRows((rs) => [row, ...withoutUnsavedNew(rs)])
    setEditing({ id, draft: { ...row }, isNew: true })
  }

  // asc → desc → off, so the original order is always one click away.
  const toggleSort = (key: ColumnKey) =>
    setSort((s) => (s?.key !== key ? { key, order: 'asc' } : s.order === 'asc' ? { key, order: 'desc' } : null))

  const visibleRows = useMemo(() => {
    if (!sort) return rows
    // An unsaved new record stays pinned at the top while it's being filled in.
    const pinned = editing?.isNew ? rows.filter((r) => r.id === editing.id) : []
    const rest = rows.filter((r) => !pinned.includes(r)).sort(compareRows(sort.key, sort.order))
    return [...pinned, ...rest]
  }, [rows, sort, editing])

  const startResize = (key: ColumnKey) => (e: PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const handle = e.currentTarget as HTMLElement
    const start =
      widths ??
      (Object.fromEntries(
        columns.map((c) => [c.key, headCells.current[c.key]?.getBoundingClientRect().width ?? MIN_COL_WIDTH]),
      ) as ColumnWidths)
    const startX = e.clientX

    const onMove = (ev: globalThis.PointerEvent) =>
      setWidths({ ...start, [key]: Math.max(MIN_COL_WIDTH, start[key] + ev.clientX - startX) })
    const onUp = () => {
      handle.classList.remove('resizing')
      document.body.style.removeProperty('cursor')
      document.body.style.removeProperty('user-select')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    handle.classList.add('resizing')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    setWidths(start)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const tableWidth = widths ? Object.values(widths).reduce((a, b) => a + b, 0) + ACTIONS_WIDTH : '100%'

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') discard()
  }

  return (
    <>
      <PageHeader onNewRecord={addRecord} />
      <TableContainer
        sx={{
          flex: 1,
          minHeight: 0,
          scrollbarColor: `${tokens.primary} transparent`,
          // Older WebKit ignores scrollbar-color, so style the bar directly there too.
          '&::-webkit-scrollbar': { height: 8, width: 8 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: tokens.primary, borderRadius: 4 },
        }}
      >
        <Table sx={{ tableLayout: 'fixed', borderCollapse: 'collapse', width: tableWidth }}>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell
                  key={c.key}
                  ref={(el) => {
                    headCells.current[c.key] = el as HTMLTableCellElement | null
                  }}
                  sx={{ ...headCellSx, px: 0, position: 'relative', ...(widths && { width: widths[c.key] }) }}
                  sortDirection={sort?.key === c.key ? sort.order : false}
                >
                  <TableSortLabel
                    active={sort?.key === c.key}
                    direction={sort?.key === c.key ? sort.order : 'asc'}
                    onClick={() => toggleSort(c.key)}
                    IconComponent={SortArrow}
                    sx={{ ...sortLabelSx, height: 44, px: '10px' }}
                  >
                    <Box component="span" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.label}
                    </Box>
                  </TableSortLabel>
                  <ResizeHandle onPointerDown={startResize(c.key)} />
                </TableCell>
              ))}
              <TableCell sx={{ ...headCellSx, width: ACTIONS_WIDTH, textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => {
              const isEditing = editing?.id === row.id
              return (
                <TableRow key={row.id} sx={isEditing ? { bgcolor: tokens.surface } : undefined}>
                  {columns.map((c) => {
                    const editable = isEditing && c.editable
                    return (
                      <TableCell
                        key={c.key}
                        title={editable ? undefined : row[c.key]}
                        sx={{
                          ...bodyCellSx,
                          ...(editable && {
                            p: 0,
                            '&:focus-within': { outline: `1px solid ${tokens.primary}`, outlineOffset: -1 },
                          }),
                          ...(isEditing && !c.editable && { color: tokens.textMuted }),
                        }}
                      >
                        {editable ? (
                          <InputBase
                            fullWidth
                            autoFocus={c.key === columns.find((col) => col.editable)?.key}
                            value={editing.draft[c.key]}
                            onChange={(e) =>
                              setEditing({ ...editing, draft: { ...editing.draft, [c.key]: e.target.value } })
                            }
                            onKeyDown={onKeyDown}
                            inputProps={{ 'aria-label': c.label }}
                            sx={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: tokens.text,
                              '& input': { p: '10px', height: 'auto', lineHeight: 'normal' },
                            }}
                          />
                        ) : (
                          row[c.key]
                        )}
                      </TableCell>
                    )
                  })}
                  <TableCell sx={{ p: '10px', border: 'none', width: ACTIONS_WIDTH }}>
                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {isEditing ? (
                        <>
                          <Tooltip title="Save">
                            <IconButton sx={actionButtonSx} onClick={save} aria-label="Save row">
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Discard">
                            <IconButton sx={actionButtonSx} onClick={discard} aria-label="Discard changes">
                              <DiscardIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <IconButton sx={actionButtonSx} onClick={() => startEdit(row)} aria-label="Edit row">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton sx={actionButtonSx} onClick={() => askDelete(row)} aria-label="Delete row">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteRecordDialog
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
