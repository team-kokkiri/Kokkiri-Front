<template>
  <div class="mypage-wrap">
    <!-- 프로필 박스는 항상 노출 -->
    <MyProfileBox
        @logout="handleLogout"
        @profile-image-change="handleProfileImageChange"
    />

    <!-- 기본 마이페이지 컨텐츠 -->
    <template v-if="currentView === 'main'">
      <MyAccountBox
          @profile-image-change="handleProfileImageChange"
          @nickname-change="handleNicknameChange"
          @password-change="handlePasswordChange"
          @class-code-change="handleClassCodeChange"
          @account-delete="handleAccountDelete"
      />
      <MyCommunityBox
          @my-posts="handleMyPosts"
          @my-comments="handleMyComments"
      />
    </template>

    <!-- 프로필 사진 변경 -->
    <template v-else-if="currentView === 'profile-image'">
      <div>프로필 사진 변경 컴포넌트</div>
    </template>

    <!-- 닉네임 변경 -->
    <template v-else-if="currentView === 'nickname'">
      <NicknameSetting
          @back="handleBackToMain"
          @duplicate-check="handleDuplicateCheck"
          @save="handleNicknameSave"
          ref="nicknameSettingRef"
      />
    </template>

    <!-- 비밀번호 변경 -->
    <template v-else-if="currentView === 'password'">
      <PasswordSetting
          @back="handleBackToMain"
          @verify-current-password="handleVerifyCurrentPassword"
          @save="handlePasswordSave"
          ref="passwordSettingRef"
      />
    </template>

    <!-- 반 코드 변경 -->
    <template v-else-if="currentView === 'class-code'">
      <ClassCodeSetting
          @back="handleBackToMain"
          @verify-class-code="handleVerifyClassCode"
          @save="handleClassCodeSave"
          ref="classCodeSettingRef"
      />
    </template>

    <!-- 회원탈퇴 모달 -->
    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal-box">
        <p class="modal-msg">정말 회원 계정을 삭제하시겠습니까?</p>
        <div class="modal-btn-group">
          <button class="modal-btn yes" @click="onDeleteAccount">예</button>
          <button class="modal-btn no" @click="showDeleteModal = false">아니오</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import MyProfileBox from '@/components/mypage/MyProfileBox.vue'
import MyAccountBox from '@/components/mypage/MyAccountBox.vue'
import MyCommunityBox from '@/components/mypage/MyCommunityBox.vue'
import NicknameSetting from '@/components/mypage/NicknameSetting.vue'
import PasswordSetting from '@/components/mypage/PasswordSetting.vue'
import ClassCodeSetting from '@/components/mypage/ClassCodeSetting.vue'
import instance from "@/utils/axios";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores";

defineEmits([
  'logout',
  'my-posts',
  'my-comments'
])

const currentView = ref('main')
const nicknameSettingRef = ref(null)
const passwordSettingRef = ref(null)
const classCodeSettingRef = ref(null)
const showDeleteModal = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleBackToMain = () => {
  currentView.value = 'main'
}

const handleLogout = () => {
  try {
    instance.post('api/members/logout')
    userStore.clearUser({})
    document.cookie = 'refreshToken=; Path=/; Max-Age=0;'
    router.replace('/login')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}

const handleProfileImageChange = () => {
  console.log('프로필 사진 변경 클릭')
}

const handleNicknameChange = () => {
  currentView.value = 'nickname'
}
const handlePasswordChange = () => {
  currentView.value = 'password'
}
const handleClassCodeChange = () => {
  currentView.value = 'class-code'
}
const handleAccountDelete = () => {
  showDeleteModal.value = true
}

// 여기 반드시 중괄호로 닫아주세요!!
const onDeleteAccount = async () => {
  try {
    await instance.delete('/api/members', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      },
      withCredentials: true
    })
    alert('회원 탈퇴가 완료되었습니다.')
    userStore.clearUser({})
    localStorage.removeItem('accessToken')
    showDeleteModal.value = false
    router.replace('/login')
  } catch (e) {
    alert('회원 탈퇴 중 오류가 발생했습니다.')
    showDeleteModal.value = false
  }
} // <-- 중괄호 추가!

const handleMyPosts = () => {
  router.push(`/main-page/my-written-posts`)
}
const handleMyComments = () => {
  router.push(`/main-page/my-commented-posts`)
}
const handleNicknameSave = async (nickname) => {
  try {
    console.log('닉네임 저장:', nickname)
    currentView.value = 'main'
  } catch (error) {
    console.error('닉네임 저장 오류:', error)
  }
}
const handlePasswordSave = async (passwords) => {
  try {
    console.log('비밀번호 변경:', passwords)
    currentView.value = 'main'
  } catch (error) {
    console.error('비밀번호 변경 오류:', error)
  }
}
const handleClassCodeSave = async (classCode) => {
  try {
    console.log('반 코드 변경:', classCode)
    if (classCodeSettingRef.value) {
      classCodeSettingRef.value.setSaveResult('반 코드가 성공적으로 변경되었습니다.')
    }
    setTimeout(() => {
      currentView.value = 'main'
    }, 1500)
  } catch (error) {
    console.error('반 코드 변경 오류:', error)
    if (classCodeSettingRef.value) {
      classCodeSettingRef.value.setErrorMessage('반 코드 변경 중 오류가 발생했습니다.')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style';

.mypage-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 24px;
  margin-left: auto;
  margin-right: auto;
}

/* 모달 스타일 예시 */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}
.modal-box {
  background: #fff;
  border-radius: 14px;
  padding: 32px 24px 24px 24px;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  text-align: center;
}
.modal-msg {
  font-size: 1.08rem; margin-bottom: 22px;
  line-height: 1.6;
}
.modal-btn-group {
  display: flex; gap: 18px; justify-content: center;
}
.modal-btn {
  min-width: 104px; padding: 9px 0;
  border: none; border-radius: 8px;
  font-weight: 500; font-size: 1rem;
  cursor: pointer;
  &.yes { background: #ff6565; color: #fff; }
  &.no { background: #eee; color: #222; }
}
</style>
