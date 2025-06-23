<template>
  <div class="board-action-manager">
    <button
        v-for="action in visibleActions"
        :key="action.type"
        :class="['btn-action', `btn-${action.type}`]"
        @click="handleAction(action.type)"
    >
      <i v-if="action.icon" :class="action.icon"></i>
      {{ action.label }}
      <span v-if="action.count > 0" class="count">{{ action.count }}</span>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

// Props 정의
const props = defineProps({
  // 타입 (post, comment, reply)
  type: {
    type: String,
    required: true,
    validator: value => ['post', 'comment', 'reply'].includes(value)
  },
  // 각 액션별 카운트
  counts: {
    type: Object,
    default: () => ({})
  },
  // 대상 아이템 (게시글, 댓글, 대댓글 객체)
  item: {
    type: Object,
    default: () => ({})
  },
  // 현재 사용자 ID
  currentUserId: {
    type: [String, Number],
    default: null
  }
})

// Emits 정의
const emit = defineEmits([
  'action' // 모든 액션을 하나의 이벤트로 통합
])

// 액션 설정 객체
const actionConfig = {
  like: {
    label: '공감',
    icon: null,
    needsConfirm: false
  },
  edit: {
    label: '수정',
    icon: null,
    needsConfirm: false
  },
  delete: {
    label: '삭제',
    icon: null,
    needsConfirm: true,
    confirmMessage: '정말 삭제하시겠습니까?'
  },
  reply: {
    label: '대댓글',
    icon: null,
    needsConfirm: false
  },
  chat: {
    label: '채팅',
    icon: null,
    needsConfirm: false
  },
  report: {
    label: '신고',
    icon: null,
    needsConfirm: true,
    confirmMessage: '신고하시겠습니까?'
  }
}

// 본인 작성 여부 체크
const isOwnItem = computed(() => {
  return props.currentUserId && props.item.authorId &&
      props.currentUserId === props.item.authorId
})

// 표시할 액션들 계산
const visibleActions = computed(() => {
  let actionTypes = []

  if (isOwnItem.value) {
    // 본인 글일 때: 수정, 삭제만
    actionTypes = ['edit', 'delete']
  } else {
    // 남의 글일 때
    if (props.type === 'post') {
      // 본문: 채팅, 신고
      actionTypes = ['chat', 'report']
    } else if (props.type === 'comment') {
      // 댓글: 대댓글, 공감, 채팅, 신고
      actionTypes = ['reply', 'like', 'chat', 'report']
    } else if (props.type === 'reply') {
      // 대댓글: 공감, 채팅, 신고
      actionTypes = ['like', 'chat', 'report']
    }
  }

  return actionTypes.map(actionType => {
    const config = actionConfig[actionType]
    return {
      type: actionType,
      label: config.label,
      icon: config.icon,
      count: props.counts[actionType] || 0
    }
  })
})

// 액션 핸들러
const handleAction = (actionType) => {
  const config = actionConfig[actionType]

  // 확인 메시지가 필요한 액션
  if (config.needsConfirm) {
    if (!confirm(config.confirmMessage)) {
      return
    }
  }

  // 통합 이벤트 발생
  emit('action', {
    type: actionType,
    item: props.item
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style.scss';

.board-action-manager {
  display: flex;
  gap: 1px;

  .btn-action {
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #999999;
    background: transparent;
    border: none;
    cursor: pointer;
    line-height: 1.252;

    &:hover {
      color: #333333;
    }

    .count {
      margin-left: 4px;
      color: #ed2040;
      font-weight: 600;
    }
  }
}
</style>