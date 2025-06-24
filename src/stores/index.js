// src/stores/index.js
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 모든 스토어를 export
export { useUserStore } from './user'
