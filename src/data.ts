export type RecordRow = {
  id: number
  status: string
  created_at: string
  updated_at: string
  allowed_dept: string
  thumbnail: string
  file: string
  description: string
  code: string
  project: string
  updated_by: string
  created_by: string
}

export type ColumnKey = Exclude<keyof RecordRow, 'id'>

export const columns: { key: ColumnKey; label: string; editable: boolean }[] = [
  { key: 'status', label: 'status', editable: true },
  { key: 'created_at', label: 'created_at', editable: false },
  { key: 'updated_at', label: 'updated_at', editable: false },
  { key: 'allowed_dept', label: 'allowed_dept', editable: true },
  { key: 'thumbnail', label: 'thumbnail', editable: true },
  { key: 'file', label: 'file', editable: true },
  { key: 'description', label: 'description', editable: true },
  { key: 'code', label: 'code', editable: true },
  { key: 'project', label: 'project', editable: true },
  { key: 'updated_by', label: 'updated_by', editable: false },
  { key: 'created_by', label: 'created_by', editable: false },
]

const row = (
  id: number,
  created_at: string,
  updated_at: string,
  code: string,
  updated_by: string,
  created_by = 'Patrick Kuo',
  description = '',
): RecordRow => ({
  id,
  status: '-',
  created_at,
  updated_at,
  allowed_dept: '',
  thumbnail: '-',
  file: '-',
  description,
  code,
  project: 'Graffito Project',
  updated_by,
  created_by,
})

export const initialRows: RecordRow[] = [
  row(1, '28/2/2026, 11:42:32', '28/2/2026, 11:42:32', 'Scene_3_Running…', '-'),
  row(2, '28/2/2026, 12:02:18', '28/2/2026, 12:02:18', 'Scene_2_CoolKids', '-'),
  row(3, '28/2/2026, 12:13:54', '28/2/2026, 12:13:54', 'Scene_5_Grandm…', '-'),
  row(4, '28/2/2026, 11:31:25 am', '2/3/2026, 2:19:56 am', 'Scene_1_Elemento…', 'Patrick Kuo'),
  row(5, '28/2/2026, 2:30:44', '28/2/2026, 2:30:44', 'Scene_7-9_Graffit…', '-'),
  row(6, '28/2/2026, 2:39:08', '28/2/2026, 2:39:26', 'Scene_13_Element…', 'Patrick Kuo'),
  row(7, '28/2/2026, 2:53:14 pm', '28/2/2026, 2:53:14 pm', 'Scene_14_Space', '-'),
  row(8, '28/2/2026, 2:53:50', '28/2/2026, 2:53:50', 'Scene_15_Imagino…', '-'),
  row(9, '1/3/2026, 1:47:27 am', '1/3/2026, 1:47:27 am', 'Scene_16_Bottom…', '-'),
  row(10, '1/3/2026, 1:47:41 am', '1/3/2026, 1:47:41 am', 'Scene_17_TopofCo…', '-'),
  row(11, '5/3/2026, 3:54:49 pm', '5/3/2026, 3:54:49 pm', 'Selects_JohnB', '-', 'Jhon Brennan', "john brennan's favs"),
  row(12, '2/3/2026, 2:45:36 pm', '6/3/2026, 3:50:23 pm', 'Selects_Pat', 'Patrick Kuo', 'Patrick Kuo', "p's favs"),
]

export const emptyRow = (id: number): RecordRow => {
  const now = new Date().toLocaleString('en-AU')
  return {
    id,
    status: '',
    created_at: now,
    updated_at: now,
    allowed_dept: '',
    thumbnail: '',
    file: '',
    description: '',
    code: '',
    project: '',
    updated_by: '-',
    created_by: 'SS',
  }
}

export const touch = (r: RecordRow): RecordRow => ({
  ...r,
  updated_at: new Date().toLocaleString('en-AU'),
})

export type SortOrder = 'asc' | 'desc'

const DATE_KEYS: ColumnKey[] = ['created_at', 'updated_at']

// Dates are stored as en-AU display strings ("28/2/2026, 2:53:14 pm"), so they
// need parsing to sort chronologically rather than alphabetically.
const parseDate = (s: string) => {
  const m = s.match(/^(\d+)\/(\d+)\/(\d+),\s*(\d+):(\d+):(\d+)\s*(am|pm)?/i)
  if (!m) return NaN
  const [, d, mo, y, h, mi, sec, ampm] = m
  let hours = Number(h) % (ampm ? 12 : 24)
  if (ampm?.toLowerCase() === 'pm') hours += 12
  return new Date(+y, +mo - 1, +d, hours, +mi, +sec).getTime()
}

const isBlank = (v: string) => v.trim() === '' || v === '-'

export const compareRows = (key: ColumnKey, order: SortOrder) => (a: RecordRow, b: RecordRow) => {
  const av = a[key]
  const bv = b[key]
  // Empty values always sink to the bottom, whichever direction is active.
  if (isBlank(av) || isBlank(bv)) return Number(isBlank(av)) - Number(isBlank(bv))
  const diff = DATE_KEYS.includes(key)
    ? parseDate(av) - parseDate(bv)
    : av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' })
  return order === 'asc' ? diff : -diff
}
