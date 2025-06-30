<template>
  <div class="calendar-container">
    <!-- 상단 월/년, 월 이동 버튼 -->
    <div class="calendar-header">
      <button class="month-btn" @click="prevMonth">&lt;</button>
      <span class="calendar-title">{{ displayMonth }}</span>
      <button class="month-btn" @click="nextMonth">&gt;</button>
    </div>
    <!-- 범례 -->
    <div class="calendar-legend">
      <span class="legend-box public"></span><span class="legend-label">공용 일정</span>
      <span class="legend-box private"></span><span class="legend-label">개인 일정</span>
    </div>

    <!-- 달력 그리드 -->
    <div class="calendar-grid">
      <div class="calendar-day-label" v-for="(label, i) in dayLabels" :key="i">{{ label }}</div>
      <div
          v-for="cell in calendarCells"
          :key="cell.key"
          :class="['calendar-cell', { today: cell.isToday }]"
          @click="cell.day && openAddDialog(cell)"
          tabindex="0"
      >
        <div class="cell-date">{{ cell.day || '' }}</div>
        <div class="cell-events">
          <div
              v-for="event in cell.events"
              :key="event.id"
              :class="['cell-event', { public: event.isPublic, selected: selectedEvent && selectedEvent.id === event.id }]"
              :title="event.description"
              @click.stop="openDetailDialog(event)"
          >
            {{ truncate(event.title, 13) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 일정 상세 모달 -->
    <div v-if="showDetailDialog" class="dialog-backdrop">
      <div class="dialog event-detail-dialog">
        <h3>
          <span v-if="selectedEvent && selectedEvent.isPublic" class="public-label">[공용]</span>
          <span v-else class="private-label">[개인]</span>
          {{ selectedEvent && selectedEvent.title }}
        </h3>
        <div class="event-date">{{ selectedEvent && selectedEvent.date }}</div>
        <div class="event-desc">{{ (selectedEvent && selectedEvent.description) || '설명 없음' }}</div>
        <div class="dialog-btns">
          <button type="button" @click="closeDetailDialog">닫기</button>
          <button
              v-if="canEditOrDelete"
              type="button"
              @click="openEditDialog"
          >수정</button>
          <button
              v-if="canEditOrDelete"
              type="button"
              @click="deleteEvent"
          >삭제</button>
        </div>
      </div>
    </div>

    <!-- 일정 수정 모달 (분리) -->
    <div v-if="showEditDialog" class="dialog-backdrop">
      <div class="dialog">
        <h3>일정 수정</h3>
        <form @submit.prevent="submitEditEvent">
          <input
              v-model.trim="editEventForm.title"
              placeholder="제목"
              required
              autofocus
          />
          <textarea
              v-model.trim="editEventForm.description"
              placeholder="설명"
              rows="2"
          ></textarea>
          <div class="dialog-btns">
            <button type="submit">저장</button>
            <button type="button" @click="closeEditDialog">취소</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 일정 추가 모달 -->
    <div v-if="showAddDialog" class="dialog-backdrop">
      <div class="dialog">
        <h3>{{ selectedDayStr }} 일정 추가</h3>
        <form @submit.prevent="addEvent">
          <input
              v-model.trim="newEvent.title"
              placeholder="제목"
              required
              autofocus
          />
          <textarea
              v-model.trim="newEvent.description"
              placeholder="설명"
              rows="2"
          ></textarea>
          <div class="dialog-btns">
            <button type="submit">등록</button>
            <button type="button" @click="closeDialog">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { toast } from "vue3-toastify";
import axios from '@/utils/axios'

const userStore = useUserStore()

const today = new Date()
const currentMonth = ref(today.getMonth() + 1)
const currentYear = ref(today.getFullYear())

const displayMonth = computed(() =>
    `${currentYear.value}년 ${currentMonth.value}월`
)
const dayLabels = ['일', '월', '화', '수', '목', '금', '토']

function truncate(str, len = 13) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

const calendarCells = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value, 0)
  const startWeekDay = firstDay.getDay()
  const totalDays = lastDay.getDate()
  const cells = []

  for (let i = 0; i < startWeekDay; i++) {
    cells.push({ day: null, key: `empty-${i}`, isToday: false, events: [] })
  }
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isTodayVal =
        today.getFullYear() === currentYear.value &&
        today.getMonth() + 1 === currentMonth.value &&
        today.getDate() === d
    const events = calendarEvents.value.filter(ev => ev.date === dateStr)
    cells.push({
      day: d,
      key: `date-${d}`,
      isToday: isTodayVal,
      dateStr,
      events,
    })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, key: `post-empty-${cells.length}`, isToday: false, events: [] })
  }
  return cells
})

const calendarEvents = ref([])

async function fetchEvents() {
  if (!userStore.id) return
  try {
    const params = {
      memberId: userStore.id,
      startDate: `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-01`,
      endDate: `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${new Date(currentYear.value, currentMonth.value, 0).getDate()}`
    }
    const { data } = await axios.get('/api/calendars/user', { params })
    calendarEvents.value = data.map(ev => ({
      id: ev.id,
      title: ev.title,
      description: ev.description,
      date: ev.date,
      isPublic: ev.isPublic,
      memberId: ev.memberId,
    }))
  } catch (e) {
    toast.error('일정 불러오기 실패: ' + (e.response?.data?.message || e.message),{autoClose:1000})
    calendarEvents.value = []
  }
}

const showDetailDialog = ref(false)
const selectedEvent = ref(null)

const canEditOrDelete = computed(() =>
    selectedEvent.value &&
    (
        // 본인 개인 일정
        (!selectedEvent.value.isPublic && selectedEvent.value.memberId === userStore.id)
        ||
        // 공용 일정 + 내가 관리자
        (selectedEvent.value.isPublic && userStore.isAdmin)
    )
)

function openDetailDialog(event) {
  selectedEvent.value = { ...event }
  showDetailDialog.value = true
}
function closeDetailDialog() {
  showDetailDialog.value = false
  selectedEvent.value = null
}

// 일정 수정 모달
const showEditDialog = ref(false)
const editEventForm = ref({ title: '', description: '', date: '' })

function openEditDialog() {
  if (!canEditOrDelete.value) {
    toast.error('본인 개인 일정만 수정할 수 있습니다!',{autoClose:500})
    return
  }
  // 기존 값으로 채우기
  editEventForm.value = {
    title: selectedEvent.value.title,
    description: selectedEvent.value.description,
    date: selectedEvent.value.date,
  }
  showEditDialog.value = true
}
function closeEditDialog() {
  showEditDialog.value = false
}

// 수정 API 호출
async function submitEditEvent() {
  if (!editEventForm.value.title.trim()) {
    toast.success('제목을 입력하세요!',{autoClose:500})
    return
  }
  try {
    await axios.patch(`/api/calendars/${selectedEvent.value.id}`, {
      ...editEventForm.value
    }, { params: { memberId: userStore.id } })
    toast.success('수정되었습니다!',{autoClose:500})
    showEditDialog.value = false
    showDetailDialog.value = false
    await fetchEvents()
  } catch (e) {
    toast.error('수정 실패: ' + (e.response?.data?.message || e.message),{autoClose:500})
  }
}

function deleteEvent() {
  if (!canEditOrDelete.value) {
    toast.error('본인 개인 일정만 삭제할 수 있습니다!',{autoClose:500})
    return
  }
  if (confirm('정말 삭제할까요?')) {
    axios.delete(`/api/calendars/${selectedEvent.value.id}`, { params: { memberId: userStore.id } })
        .then(() => {
          toast.success('삭제되었습니다!',{autoClose:500})
          closeDetailDialog()
          fetchEvents()
        })
        .catch(e => toast.error('삭제 실패: ' + (e.response?.data?.message || e.message)),{autoClose:500})
  }
}

onMounted(async () => {
  await userStore.restoreUser()
  await fetchEvents()
})

function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
  fetchEvents()
}
function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
  fetchEvents()
}

const showAddDialog = ref(false)
const selectedDay = ref(null)
const newEvent = ref({ title: '', description: '' })

const selectedDayStr = computed(() =>
    selectedDay.value
        ? `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`
        : ''
)

function openAddDialog(cell) {
  selectedDay.value = cell.day
  showAddDialog.value = true
  newEvent.value = { title: '', description: '' }
  nextTick(() => {
    document.querySelector('.dialog input')?.focus()
  })
}

function closeDialog() {
  showAddDialog.value = false
  newEvent.value = { title: '', description: '' }
}

async function addEvent() {
  const dateStr = selectedDayStr.value
  if (!newEvent.value.title.trim()) {
    toast.success('제목을 입력해 주세요!',{autoClose:1000})
    return
  }
  try {
    await axios.post('/api/calendars', {
      ...newEvent.value,
      date: dateStr,
      isPublic: userStore.isAdmin ? true : false
    }, { params: { memberId: userStore.id } })
    toast.success('일정이 등록되었습니다!',{autoClose:500})
    showAddDialog.value = false
    await fetchEvents()
  } catch (e) {
    const errMsg = e.response?.data?.message || e.response?.data || e.message
    toast.error('등록 실패: ' + errMsg)
  }
}
</script>

<style scoped>
.calendar-container {
  width: 100%;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 28px #0001;
  padding: 32px 2vw 28px 2vw;
}
.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 42px;
  margin-bottom: 8px;
}
.month-btn {
  font-size: 2.4em;
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  font-weight: bold;
  line-height: 1;
  padding: 0 12px;
}
.calendar-title {
  font-size: 2.2em;
  font-weight: bold;
  color: #1976d2;
  letter-spacing: 2px;
}

/* === 범례 === */
.calendar-legend {
  display: flex;
  gap: 22px;
  align-items: center;
  margin-bottom: 12px;
  margin-left: 12px;
  font-size: 1.03em;
}
.legend-box {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  margin-right: 6px;
  vertical-align: middle;
  border: 1.5px solid #ddd;
}
.legend-box.public {
  background: #5da3f7;
}
.legend-box.private {
  background: #b9e769;
}
.legend-label {
  margin-right: 15px;
}

/* === 달력 === */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 14px;
  width: 100%;
}
.calendar-day-label {
  font-weight: bold;
  text-align: center;
  margin-bottom: 3px;
  color: #5476a6;
  background: #e3e7ef;
  border-radius: 8px;
  font-size: 1.29em;
  padding: 9px 0;
}
.calendar-cell {
  width: 100%;
  aspect-ratio: 0.9 / 1;
  background: #f7f7fa;
  border-radius: 12px;
  cursor: pointer;
  padding: 15px 12px 7px 12px;
  display: flex;
  flex-direction: column;
  transition: background 0.15s, border-radius 0.3s;
  position: relative;
  font-size: 1.18em;
  overflow: hidden;
}
.calendar-cell:hover {
  background: #e3f2fd;
}
.calendar-cell.today {
  border: 3.5px solid #1976d2;
  background: #e3f2fd;
}
.cell-date {
  font-size: 1.18em;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 7px;
}
.cell-events {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.cell-event {
  font-size: 1em;
  background: #b9e769;
  color: #222;
  border-radius: 8px;
  padding: 4px 8px;
  margin-top: 2px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.cell-event.public {
  background: #5da3f7;
  color: #fff;
  font-weight: 600;
}
/* === 모달 === */
.dialog-backdrop {
  position: fixed; top:0; left:0; width:100vw; height:100vh;
  background: rgba(0,0,0,0.3);
  display:flex; align-items:center; justify-content:center;
  z-index: 9999;
}
.dialog {
  background:#fff; padding:2.4rem; border-radius:1.2rem; min-width:320px; box-shadow: 0 4px 24px #0002;
}
.dialog-btns { display:flex; gap:1rem; margin-top:1.4rem; }
@media (max-width: 1050px) {
  .calendar-container {
    max-width: 98vw;
    padding: 1vw;
  }
  .calendar-header { gap: 16px; }
  .calendar-title { font-size: 1.4em; }
  .calendar-legend { font-size: 0.96em; gap: 12px; }
  .calendar-grid { gap: 2vw; }
  .calendar-cell { min-height: 52px; font-size: 1.02em; }
  .calendar-day-label { font-size: 1em; }
}
@media (max-width: 700px) {
  .calendar-container {
    padding: 1vw 0.5vw;
  }
  .calendar-header { gap: 4px; }
  .calendar-title { font-size: 1.01em; }
  .calendar-legend { font-size: 0.92em; gap: 7px; }
  .calendar-grid { gap: 0.5vw; }
  .calendar-cell { min-height: 28px; font-size: 0.91em; padding: 4px 2px; }
  .calendar-day-label { font-size: 0.91em; }
}
.dialog-backdrop {
  position: fixed; top:0; left:0; width:100vw; height:100vh;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
  animation: fadein-bg .18s;
}
@keyframes fadein-bg {
  0% { background: rgba(0,0,0,0); }
  100% { background: rgba(0,0,0,0.3); }
}
.dialog {
  background: #fff;
  padding: 2.2rem 1.5rem 1.8rem 1.5rem;
  border-radius: 1.2rem;
  min-width: 340px;
  box-shadow: 0 4px 32px #0003;
  animation: scalein .18s;
}
@keyframes scalein {
  0% { transform: scale(0.98); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.dialog h3 {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 1.2rem;
  color: #1a2a55;
  letter-spacing: 1px;
}
.dialog input, .dialog textarea {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  border: 1.5px solid #d4deec;
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 1em;
  background: #f8fbff;
  outline: none;
  transition: border 0.2s;
}
.dialog input:focus, .dialog textarea:focus {
  border: 1.5px solid #1976d2;
  background: #f4faff;
}
.dialog-btns {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
.dialog-btns button {
  background: #1976d2;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 7px;
  padding: 9px 24px;
  font-size: 1.01em;
  cursor: pointer;
  transition: background 0.14s;
}
.dialog-btns button[type="button"] {
  background: #d4deec;
  color: #455;
}
.dialog-btns button:active {
  filter: brightness(0.96);
}

.cell-event.selected {
  box-shadow: 0 0 0 2.5px #1976d2 inset;
  border: 2px solid #1976d2;
  background: #fffbe6 !important;
  color: #1976d2 !important;
  font-weight: bold;
  z-index: 1;
}

.event-detail-dialog {
  min-width: 340px;
  max-width: 92vw;
  box-shadow: 0 6px 32px #1976d222;
}
.public-label {
  color: #1976d2;
  font-weight: bold;
  margin-right: 6px;
}
.private-label {
  color: #b9e769;
  font-weight: bold;
  margin-right: 6px;
}
.event-date {
  font-size: 1.08em;
  margin-bottom: 0.8em;
  color: #4a67ad;
}
.event-desc {
  margin-bottom: 1.2em;
  color: #2c3540;
  white-space: pre-line;
  min-height: 2.6em;
}
@media (max-width: 700px) {
  .dialog { min-width: 90vw; padding: 1.2rem 1vw 1rem 1vw; }
}

</style>
