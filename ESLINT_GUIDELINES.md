# ESLint 코딩 가이드라인

## 🔧 Vue 3 Composition API 작성 규칙

### 1. `<script setup>` 필수 import 규칙
Vue 3 Composition API 사용시 반드시 다음과 같이 import 해야 함:

```javascript
// ❌ 잘못된 예시 (ESLint 에러 발생)
<script setup>
const props = defineProps({...})
const emit = defineEmits([...])
</script>

// ✅ 올바른 예시
<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({...})
const emit = defineEmits([...])
</script>
```

### 2. 필수 Import 목록
다음 함수들을 사용할 때는 반드시 import 해야 함:

```javascript
import { 
  ref, 
  reactive, 
  computed, 
  watch, 
  onMounted, 
  onUnmounted,
  defineProps, 
  defineEmits,
  defineExpose 
} from 'vue'
```

### 3. Props 사용 규칙

```javascript
// ❌ Props를 선언했지만 사용하지 않는 경우
const props = defineProps({
  title: String
}) // 'props' is assigned a value but never used

// ✅ Props를 사용하지 않는 경우
defineProps({
  title: String
})

// ✅ Props를 사용하는 경우
const props = defineProps({
  title: String
})
console.log(props.title) // 실제로 사용
```

### 4. 함수 매개변수 규칙

```javascript
// ❌ 매개변수를 선언했지만 사용하지 않는 경우
function handleClick(event) {
  console.log('clicked') // event는 사용하지 않음
}

// ✅ 매개변수를 사용하지 않는 경우
function handleClick() {
  console.log('clicked')
}

// ✅ 매개변수가 필요한 경우만 선언
function handleClick(event) {
  console.log('Event:', event) // 실제로 사용
}
```

### 5. 변수 선언 규칙

```javascript
// ❌ 선언했지만 사용하지 않는 변수
const unusedVariable = 'test' // 'unusedVariable' is defined but never used

// ✅ 실제로 사용하는 변수만 선언
const usedVariable = 'test'
console.log(usedVariable)
```

## 📝 컴포넌트 작성 템플릿

### 기본 컴포넌트 템플릿
```vue
<template>
  <div class="component-name">
    <!-- 템플릿 내용 -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'

// Props (사용하지 않으면 const 없이 선언)
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['update', 'change'])

// Reactive data
const count = ref(0)

// Computed
const doubleCount = computed(() => count.value * 2)

// Methods
function handleUpdate() {
  emit('update', count.value)
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted')
})
</script>

<style scoped>
.component-name {
  /* 스타일 */
}
</style>
```

### Props만 있는 단순 컴포넌트
```vue
<script setup>
import { defineProps } from 'vue'

// Props를 사용하지 않는 경우
defineProps({
  title: String,
  description: String
})
</script>
```

### Events만 있는 컴포넌트
```vue
<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['click', 'change'])

function handleClick() {
  emit('click')
}
</script>
```

## ⚠️ 주의사항

1. **사용하지 않는 변수/함수/매개변수는 절대 선언하지 말 것**
2. **Vue 3 Composition API 함수는 반드시 import 할 것**
3. **Props를 실제로 사용하지 않으면 const 없이 defineProps만 호출**
4. **ESLint 에러가 발생하면 즉시 수정할 것**

## 🔍 ESLint 에러 해결 체크리스트

컴포넌트 작성 후 다음을 확인:
- [ ] `defineProps`, `defineEmits` import 했는지
- [ ] 선언한 변수들을 모두 사용하는지
- [ ] 함수 매개변수를 실제로 사용하는지
- [ ] 사용하지 않는 코드는 제거했는지

이 가이드라인을 따르면 ESLint 에러 없는 깔끔한 코드를 작성할 수 있습니다.
