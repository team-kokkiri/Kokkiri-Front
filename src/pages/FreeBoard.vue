<template>
  <div class="board-free-content">
    <div class="board-free-inner">
      <!-- 헤딩 -->
      <div class="board-free-heading">
        <h2 class="board-title">자유게시판</h2>
      </div>

      <!-- 질문 배너 -->
      <div class="board-free-question">
        <img class="icon-question" src="../assets/icon/question.png" alt="질문 아이콘"/>
        <div class="question-bubble">
          <span class="question-title">질문에 답변을 달아주세요</span>
        </div>
      </div>

      <!-- 글쓰기 토글 -->
      <div class="board-free-write-toggle" v-if="!showWriteForm">
        <input
            type="text"
            class="write-placeholder"
            placeholder="새 글을 작성해주세요!"
            @focus="showWriteForm = true"
        />
        <i class="bi bi-vector-pen"></i>
      </div>

      <!-- 글쓰기 폼 -->
      <form
          ref="formRef"
          class="board-free-form"
          v-if="showWriteForm"
          @submit.prevent="submitPost"
          @focusin="onFormFocus"
          @focusout="onFormBlur"
          tabindex="0"
      >
        <div class="form-title">
          <input type="text" class="input-title" placeholder="글 제목"/>
        </div>
        <div class="form-body">
          <textarea class="input-body" placeholder="내용을 입력하세요"></textarea>
        </div>
        <div class="form-footer">
          <div class="form-actions-left">
            <button type="button" class="btn-upload-image">
              <i class="bi bi-image"></i>
            </button>
          </div>
          <div class="form-actions-right">
            <label class="checkbox-wrap">
              <input type="checkbox"/>
              <span class="label-text">질문</span>
            </label>
            <button type="submit" class="btn-submit">
              <i class="bi bi-vector-pen"></i>
            </button>
          </div>
        </div>
      </form>

      <!-- 게시글 리스트 -->
      <div class="board-free-list">
        <div
            class="board-free-item"
            v-for="item in boardList"
            :key="item.id"
        >
          <h3 class="title">{{ item.boardTitle }}</h3>
          <p class="preview">{{ item.boardContent }}</p>
          <div class="item-info">
            <span class="likes" v-if="item.likeCount > 0">
              <i class="bi bi-hand-thumbs-up"></i>
              <em>{{ item.likeCount }}</em>
            </span>
            <span class="comments" v-if="item.commentCount > 0">
              <i class="bi bi-chat"></i>
              <em>{{ item.commentCount }}</em>
            </span>
            <span class="datetime">{{ item.createdAt.slice(0, 10) }}</span>
            <span class="writer">{{ item.writer }}</span>
          </div>
        </div>
      </div>

      <!-- 하단 푸터 -->
      <div class="board-free-footer">
        <div class="search-box" v-if="currentPage === 1">
          <input type="text" placeholder="검색어를 입력하세요"/>
          <i class="bi bi-search"></i>
        </div>
        <div class="pagination" :class="{ single: currentPage === 1 }">
          <div class="pagination-left">
            <button
                v-if="currentPage > 2"
                class="btn-first"
                @click="goFirst"
            >
              <i class="bi bi-chevron-double-left"></i>
              처음
            </button>
            <button
                v-if="currentPage > 1"
                type="button"
                class="btn-prev"
                @click="goPrev"
            >
              <i class="bi bi-chevron-left"></i>
              이전
            </button>
          </div>
          <button
              type="button"
              class="btn-next"
              @click="goNext"
          >
            다음
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

</template>


<script setup>
// 포스트맨에서 가져온거 data폴더 안에 json파일로 저장해뒀음.
import boardData from '@/data/boardList.json'
import { ref, onMounted, onUnmounted } from 'vue'

//현재 페이지 저장하는 변수
const currentPage = ref(1)

// json 불러온거 보드리스트 변수에다가 담음
const boardList = boardData.boardListResDtos
const showWriteForm = ref(false)
const formRef = ref(null)

// 글쓰기 폼이 포커스 되었는지 체크 (폼 안에서 클릭·포커스 이동시 안사라지게)
let formFocusTimer = null

function onFormFocus() {
  clearTimeout(formFocusTimer)
}

function onFormBlur() {
  // 바로 숨기면 버튼 누르다 폼이 사라질 수 있어, 짧게 delay
  formFocusTimer = setTimeout(() => {
    showWriteForm.value = false
  }, 80)
}

function submitPost() {
  // 게시글 등록 로직
  showWriteForm.value = false
}

//페이지 이동 (다음버튼 이전버튼 처음버튼)
function goFirst() {
  currentPage.value = 1
}
function goPrev() {
  if (currentPage.value > 1) currentPage.value--
}
function goNext() {
  currentPage.value++
}
// 폼 바깥 클릭 감지
function handleClickOutside(e) {
  if (formRef.value && !formRef.value.contains(e.target)) {
    showWriteForm.value = false
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

</script>


<style scoped>

</style>