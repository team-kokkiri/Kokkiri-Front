# DeleteConfirmModal 컴포넌트 적용 가이드

## 개요
기존 `confirm()` 및 `alert()`를 대체하는 커스텀 삭제 확인 모달입니다.
피그마 디자인을 기반으로 제작되었으며, 마스코트OX 이미지와 함께 "네/아니오" 버튼을 제공합니다.

## 적용 완료된 파일
- `C:\Users\kosa\WebstormProjects\Kokkiri-Front\src\pages\board\FreeBoardDetail.vue` ✅

## 남은 적용 대상
다음 파일들에도 동일하게 적용 필요:
- `C:\Users\kosa\WebstormProjects\Kokkiri-Front\src\pages\board\NoticeBoardDetail.vue`
- `C:\Users\kosa\WebstormProjects\Kokkiri-Front\src\pages\board\ProjectBoardDetail.vue`
- `C:\Users\kosa\WebstormProjects\Kokkiri-Front\src\pages\board\ShareBoardDetail.vue`

## 적용 방법

### 1. Import 추가
```javascript
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { useDeleteConfirmModal } from '@/composables/useModal.js'
```

### 2. Composable 설정
```javascript
// Delete Modal 상태 관리
const { deleteModalState, showDeleteModal, hideDeleteModal } = useDeleteConfirmModal()
let deleteTarget = null
```

### 3. Template에 Modal 추가
```vue
<!-- Delete Confirm Modal -->
<DeleteConfirmModal
  :visible="deleteModalState.visible"
  :message="deleteModalState.message"
  @confirm="handleDeleteConfirm"
  @cancel="hideDeleteModal"
  @close="hideDeleteModal"
/>
```

### 4. 삭제 함수 수정
기존:
```javascript
const onDelete = async (item) => {
  if (!confirm('정말 삭제하시겠습니까?')) {
    return
  }
  // 삭제 로직...
}
```

변경 후:
```javascript
const onDelete = async (item) => {
  deleteTarget = item
  const message = item === post.value
      ? '정말 게시글을 삭제하시겠습니까?'
      : '정말 댓글을 삭제하시겠습니까?'
  
  showDeleteModal({ message })
}

// 삭제 확인 핸들러
const handleDeleteConfirm = async () => {
  if (!deleteTarget) return
  
  try {
    // 기존 삭제 로직 그대로 사용
    // deleteTarget 변수 사용
    hideDeleteModal()
  } catch (err) {
    console.error('삭제 실패', err);
    hideDeleteModal()
  } finally {
    deleteTarget = null
  }
}
```

## 컴포넌트 구조
- `DeleteConfirmModal.vue`: 삭제 확인 모달 컴포넌트
- `useDeleteConfirmModal()`: 모달 상태 관리 composable
- 각 컴포넌트마다 독립적인 상태를 가짐 (SSOT 원칙)

## 디자인 특징
- 피그마 디자인과 동일한 크기 (400x300px)
- 마스코트OX.png 이미지 사용
- "네/아니오" 버튼 (파란색 #2196F3)
- 중앙 정렬, 25% 상단 위치
