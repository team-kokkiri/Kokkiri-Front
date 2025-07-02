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
          @click="cell.day && openScheduleModal(cell)"
          tabindex="0"
      >
        <div class="cell-date">{{ cell.day || '' }}</div>
        <div class="cell-events">
          <div
              v-for="event in cell.events"
              :key="event.id"
              :class="['cell-event', { public: event.isPublic, selected: selectedEvent && selectedEvent.id === event.id }]"
              :title="event.description"
              @click.stop="openScheduleModal(cell, event)"
          >
            {{ truncate(event.title, 13) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 새로운 일정 모달 -->
    <ScheduleModal
      :is-visible="showScheduleModal"
      :is-edit-mode="isEditMode"
      :selected-date="selectedDateStr"
      :event-data="currentEventData"
      @close="closeScheduleModal"
      @submit="handleScheduleSubmit"
      @delete="handleScheduleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

import axios from '@/utils/axios'
import ScheduleModal from '@/components/common/modal/ScheduleModal.vue'

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
    console.error('일정 불러오기 실패:', e.response?.data?.message || e.message)
    calendarEvents.value = []
  }
}

// 새로운 모달 관련 상태
const showScheduleModal = ref(false)
const isEditMode = ref(false)
const selectedEvent = ref(null)
const selectedCell = ref(null)
const currentEventData = ref({ title: '', description: '' })

const selectedDateStr = computed(() => {
  if (!selectedCell.value) return ''
  const year = currentYear.value
  const month = String(currentMonth.value).padStart(2, '0')
  const day = String(selectedCell.value.day).padStart(2, '0')
  return `${year}-${month}-${day}`
})

// const canEditOrDelete = computed(() =>
//     selectedEvent.value &&
//     (
//         // 본인 개인 일정
//         (!selectedEvent.value.isPublic && selectedEvent.value.memberId === userStore.id)
//         ||
//         // 공용 일정 + 내가 관리자
//         (selectedEvent.value.isPublic && userStore.isAdmin)
//     )
// )

// 새로운 모달 관련 메서드
function openScheduleModal(cell, event = null) {
  selectedCell.value = cell
  
  if (event) {
    // 이벤트 클릭 시 - 수정 모드
    if (!canEditOrDeleteEvent(event)) {
      return
    }
    selectedEvent.value = event
    isEditMode.value = true
    currentEventData.value = {
      title: event.title,
      description: event.description
    }
  } else {
    // 빈 날짜 클릭 시 - 추가 모드
    selectedEvent.value = null
    isEditMode.value = false
    currentEventData.value = {
      title: '',
      description: ''
    }
  }
  
  showScheduleModal.value = true
}

function closeScheduleModal() {
  showScheduleModal.value = false
  selectedEvent.value = null
  selectedCell.value = null
  isEditMode.value = false
  currentEventData.value = { title: '', description: '' }
}

function canEditOrDeleteEvent(event) {
  return (
    // 본인 개인 일정
    (!event.isPublic && event.memberId === userStore.id)
    ||
    // 공용 일정 + 내가 관리자
    (event.isPublic && userStore.isAdmin)
  )
}

async function handleScheduleSubmit(formData) {
  try {
    if (isEditMode.value) {
      // 수정 모드
      await axios.patch(`/api/calendars/${selectedEvent.value.id}`, {
        title: formData.title,
        description: formData.description,
        date: selectedDateStr.value
      }, { params: { memberId: userStore.id } })

    } else {
      // 추가 모드
      await axios.post('/api/calendars', {
        title: formData.title,
        description: formData.description,
        date: selectedDateStr.value,
        isPublic: userStore.isAdmin ? true : false
      }, { params: { memberId: userStore.id } })

    }
    
    closeScheduleModal()
    await fetchEvents()
  } catch (e) {
    const errMsg = e.response?.data?.message || e.response?.data || e.message
    console.error('작업 실패:', errMsg)
  }
}

async function handleScheduleDelete() {
  if (!selectedEvent.value) return
  
  try {
    await axios.delete(`/api/calendars/${selectedEvent.value.id}`, { 
      params: { memberId: userStore.id } 
    })

    closeScheduleModal()
    await fetchEvents()
  } catch (e) {
    const errMsg = e.response?.data?.message || e.message
    console.error('삭제 실패:', errMsg)
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

.cell-event.selected {
  box-shadow: 0 0 0 2.5px #1976d2 inset;
  border: 2px solid #1976d2;
  background: #fffbe6 !important;
  color: #1976d2 !important;
  font-weight: bold;
  z-index: 1;
}

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
</style>