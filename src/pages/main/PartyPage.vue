<template>
  <div class="code-compiler">
    <h2>온라인 자바 컴파일러</h2>
    <textarea
        v-model="sourceCode"
        rows="18"
        cols="70"
        placeholder="자바 코드를 입력하세요"
    ></textarea>
    <br />
    <button :disabled="isLoading" @click="handleCompile">
      {{ isLoading ? '실행 중...' : '코드 실행' }}
    </button>

    <div v-if="output">
      <h3>실행 결과</h3>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090'
const token = localStorage.getItem('accessToken')

const sourceCode = ref(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`)
const output = ref('')
const isLoading = ref(false)

async function handleCompile() {
  try {
    isLoading.value = true

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }

    const payload = {
      sourceCode: sourceCode.value
    }

    const res = await axios.post(`${API_BASE_URL}/api/compiler/run`, payload, config)
    output.value = res.data.output

  } catch (error) {
    output.value = error.response?.data?.output || '코드 실행 중 오류 발생'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.code-compiler {
  max-width: 700px;
  margin: 40px auto;
  padding: 32px;
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fafbfc;
  box-shadow: 0 2px 16px #ddd;
}
textarea {
  width: 100%;
  font-family: 'Fira Mono', 'Menlo', monospace;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #aaa;
  padding: 10px;
  margin-bottom: 12px;
  resize: vertical;
}
button {
  padding: 8px 22px;
  border-radius: 6px;
  border: none;
  background: #4c88f7;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s;
}
button[disabled] {
  background: #b8b8b8;
  cursor: wait;
}
pre {
  margin-top: 14px;
  padding: 16px;
  background: #272822;
  color: #f8f8f2;
  border-radius: 8px;
  font-size: 1rem;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
