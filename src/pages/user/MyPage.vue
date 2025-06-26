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
      <!-- ProfileImageSetting 컴포넌트 추가 예정 -->
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

const emit = defineEmits([
  'logout',
  'my-posts',
  'my-comments'
])

// 화면 상태 관리 - 확장 가능한 구조
const currentView = ref('main') // 'main' | 'profile-image' | 'nickname' | 'password' | 'class-code'
const nicknameSettingRef = ref(null) // 닉네임 설정 컴포넌트 참조
const passwordSettingRef = ref(null) // 비밀번호 설정 컴포넌트 참조
const classCodeSettingRef = ref(null) // 반 코드 설정 컴포넌트 참조
const router = useRouter()
const userStore = useUserStore()
/**
 * 메인 화면으로 돌아가기
 */
const handleBackToMain = () => {
  currentView.value = 'main'
}

/**
 * 로그아웃 처리
 */
const handleLogout = () => {
  try {
    // 1. 서버에 로그아웃 요청
    instance.post('api/members/logout')

    // 2. 프론트 상태 초기화
    userStore.clearUser({})

    // 3. (옵션) JS에서 쿠키 직접 제거 시도
    document.cookie = 'refreshToken=; Path=/; Max-Age=0;'

    // 4. 로그인 페이지로 이동
    router.replace('/login')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}

/**
 * 프로필 사진 변경 처리
 */
const handleProfileImageChange = () => {
  // TODO: 프로필 사진 변경 로직 구현
  // 예: 파일 선택 다이얼로그 열기, 이미지 업로드 모달 등
  console.log('프로필 사진 변경 클릭')
}

/**
 * 닉네임 변경 화면으로 이동
 */
const handleNicknameChange = () => {
  currentView.value = 'nickname'
}

/**
 * 비밀번호 변경 화면으로 이동
 */
const handlePasswordChange = () => {
  currentView.value = 'password'
}

/**
 * 반 코드 변경 화면으로 이동
 */
const handleClassCodeChange = () => {
  currentView.value = 'class-code'
}

/**
 * 회원탈퇴 처리 - 별도 모달이나 확인 창으로 처리 예정
 */
const handleAccountDelete = () => {
  // TODO: 회원탈퇴 모달 또는 확인 창 처리
  console.log('회원탈퇴 처리')
}

/**
 * 내가 쓴 글 보기 처리
 */
const handleMyPosts = () => {
  emit('my-posts')
}

/**
 * 댓글 단 글 보기 처리
 */
const handleMyComments = () => {
  emit('my-comments')
}

/**
 * 닉네임 중복확인 요청 처리
 * @param {string} nickname - 확인할 닉네임
 */
// const handleDuplicateCheck = async (nickname) => {
//   try {
//     // TODO: API 호출하여 중복확인
//     // const response = await api.checkNicknameDuplicate(nickname)
//
//     // 임시로 성공으로 처리 (실제로는 API 응답에 따라 처리)
//     const isAvailable = true
//
//     if (nicknameSettingRef.value) {
//       nicknameSettingRef.value.setValidationResult(isAvailable)
//     }
//   } catch (error) {
//     console.error('닉네임 중복확인 오류:', error)
//     if (nicknameSettingRef.value) {
//       nicknameSettingRef.value.setValidationResult(false)
//     }
//   }
// }

/**
 * 닉네임 저장 요청 처리
 * @param {string} nickname - 저장할 닉네임
 */
const handleNicknameSave = async (nickname) => {
  try {
    // TODO: API 호출하여 닉네임 저장
    // await api.updateNickname(nickname)

    console.log('닉네임 저장:', nickname)

    // 저장 성공 후 메인 화면으로 돌아가기
    currentView.value = 'main'
  } catch (error) {
    console.error('닉네임 저장 오류:', error)
  }
}

/**
 * 현재 비밀번호 확인 요청 처리
 * @param {string} currentPassword - 확인할 현재 비밀번호
 */
// const handleVerifyCurrentPassword = async (currentPassword) => {
//   try {
//     // TODO: API 호출하여 현재 비밀번호 확인
//     // const response = await api.verifyCurrentPassword(currentPassword)
//
//     // 임시로 성공으로 처리 (실제로는 API 응답에 따라 처리)
//     const isValid = true
//
//     if (passwordSettingRef.value) {
//       passwordSettingRef.value.setCurrentPasswordVerification(isValid)
//     }
//   } catch (error) {
//     console.error('현재 비밀번호 확인 오류:', error)
//     if (passwordSettingRef.value) {
//       passwordSettingRef.value.setCurrentPasswordVerification(false)
//     }
//   }
// }

/**
 * 비밀번호 변경 저장 요청 처리
 * @param {Object} passwords - 현재 비밀번호와 새 비밀번호
 */
const handlePasswordSave = async (passwords) => {
  try {
    // TODO: API 호출하여 비밀번호 변경
    // await api.changePassword(passwords)

    console.log('비밀번호 변경:', passwords)

    // 저장 성공 후 메인 화면으로 돌아가기
    currentView.value = 'main'
  } catch (error) {
    console.error('비밀번호 변경 오류:', error)
  }
}

/**
 * 반 코드 확인 요청 처리
 * @param {string} classCode - 확인할 반 코드
 */
// const handleVerifyClassCode = async (classCode) => {
//   try {
//     // TODO: API 호출하여 반 코드 확인
//     // const response = await api.verifyClassCode(classCode)
//
//     // 임시로 성공으로 처리 (실제로는 API 응답에 따라 처리)
//     const isValid = true
//     const message = isValid ? '유효한 반 코드입니다.' : '존재하지 않는 반 코드입니다.'
//
//     if (classCodeSettingRef.value) {
//       classCodeSettingRef.value.setVerificationResult(isValid, message)
//     }
//   } catch (error) {
//     console.error('반 코드 확인 오류:', error)
//     if (classCodeSettingRef.value) {
//       classCodeSettingRef.value.setVerificationResult(false, '반 코드 확인 중 오류가 발생했습니다.')
//     }
//   }
// }

/**
 * 반 코드 변경 저장 요청 처리
 * @param {string} classCode - 저장할 반 코드
 */
const handleClassCodeSave = async (classCode) => {
  try {
    // TODO: API 호출하여 반 코드 변경
    // await api.changeClassCode(classCode)

    console.log('반 코드 변경:', classCode)

    if (classCodeSettingRef.value) {
      classCodeSettingRef.value.setSaveResult('반 코드가 성공적으로 변경되었습니다.')
    }

    // 저장 성공 후 잠시 후 메인 화면으로 돌아가기
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
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-top: 24px;
  margin: auto;
}
</style>