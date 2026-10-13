import { useMemo, useState, type KeyboardEvent } from 'react'
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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') discard()
  }

  return (
    <>
      <PageHeader onNewRecord={addRecord} />
      <TableContainer sx={{ flex: 1, minHeight: 0 }}>
        <Table sx={{ tableLayout: 'fixed', borderCollapse: 'collapse', width: '100%' }}>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell
                  key={c.key}
                  sx={{ ...headCellSx, px: 0 }}
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
