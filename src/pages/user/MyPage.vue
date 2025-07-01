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
    <DeleteAccountModal
      :visible="showDeleteModal"
      @confirm="confirmAccountDelete"
      @cancel="cancelAccountDelete"
      @close="closeDeleteModal"
    />
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
import DeleteAccountModal from '@/components/common/modal/DeleteAccountModal.vue'
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

// 회원탈퇴 처리 함수들
const confirmAccountDelete = async () => {
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
}

const cancelAccountDelete = () => {
  showDeleteModal.value = false
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

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
</style>
