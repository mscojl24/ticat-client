import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInterest, patchMyInfo, patchInterest, postIdDuplication } from '@api/myinfo';
import { MyInfoType } from 'types/api/myinfo';

// stores
import { useMemberStore } from '@store/useMemberStore';

// utils
import { CheckCategory } from '@utils/categories';
import { validateNickname } from '@utils/validateNickname';

// hook
import useCustomToast from '@hooks/useCustomToast';

// components
import TopHistoryBackNav from '@components/TopHistoryBackNav';
import Button from '@components/Button';
import CommonCategoryList from '@components/CommonCategoryList';
import ProfileImageUpdate from '@components/profile/ProfileImageUpdate';
import ProfileInfoNameUpdate from '@components/profile/ProfileInfoNameUpdate';

/**  2023/08/07 - 프로필 수정 페이지 - by sineTlsl */
const ProfileUpdatePage = () => {
  const { member, setMember } = useMemberStore();
  const toast = useCustomToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const memberInfo: MyInfoType = location.state.data;
  const [memberName, setMemberName] = useState(memberInfo.displayName);

  const { data } = useQuery(['userInterest'], getInterest);
  const [category, setCategory] = useState<string[]>([]);

  /** 2023/08/12 - 서버의 카테고리가 변경될 때, category 변수도 변경 - by sineTlsl */
  useEffect(() => {
    if (data && data.categories) {
      const categories = data.categories.map(interest => interest);
      setCategory(categories);
    }
  }, [data]);

  /** 2023/08/13 - 관심사 업데이트 요청 함수 생성 - by sineTlsl */
  const interestMutation = useMutation(patchInterest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userInterest']);

      navigate('/myinfo');
    },
    onError: err => {
      console.log(err);
    },
  });

  /** 2023/08/13 - 프로필 업데이트 요청 함수 생성 - by sineTlsl */
  const profileUpdateMutation = useMutation(patchMyInfo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']);

      if (member) {
        setMember({
          ...member,
          displayName: memberName,
        });
      }
      navigate('/myinfo');
    },
    onError: err => {
      console.log(err);
    },
  });

  // const idDuplicationMutation = useMutation(postIdDuplication, , {

  // });

  /** 2023/08/07 - 이전 페이지 이동 함수 - by sineTlsl */
  const goBackPage = () => {
    navigate('/myinfo');
  };

  /** 2023/08/12 - 관심사 카테고리 선택 이벤트 함수 - by sineTlsl */
  const handleCategory = (item: string) => {
    const maxLength = 5;
    setCategory(prev => CheckCategory(prev, item, maxLength));
  };

  /** 2023/08/13 - 프로필 업데이트 이벤트 함수 - by sineTlsl */
  const handleProfileUpdate = () => {
    // 닉네임 유효성 검사
    const errorMessage = validateNickname(memberName);
    if (memberName.length === 0) {
      toast({ title: '닉네임을 입력해주세요 :(', status: 'error' });
      return;
    }
    if (errorMessage) {
      toast({ title: errorMessage, status: 'error' });
      return; // 에러가 있다면 이후 코드 실행 중지
    }

    const updateProfileBody = {
      displayName: memberName,
    };

    const updateInterestBody = {
      categories: category,
    };

    profileUpdateMutation.mutate(updateProfileBody);
    interestMutation.mutate(updateInterestBody);
  };

  return (
    <ProfileUpdateContainer>
      <TopBackNavWrap>
        <TopHistoryBackNav textTitle="프로필 수정" onNavigation={goBackPage} />
      </TopBackNavWrap>
      <ProfileMainWrap>
        <ProfileContentWrap>
          {data && (
            <ProfileWrap>
              <ProfileImageUpdate profileUrl={memberInfo.profileUrl} />
              <ProfileInfoNameUpdate memberName={memberName} setMemberName={setMemberName} email={memberInfo.email} />
            </ProfileWrap>
          )}
          <CategoryWrap>
            <p className="category-title">* 관심사는 최대 5개까지 등록 가능합니다.</p>
            <CommonCategoryList width="100%" category={category} handleCategory={handleCategory} />
          </CategoryWrap>
        </ProfileContentWrap>
        <ProfileUpdateWrap>
          <Button onClick={handleProfileUpdate}>저장</Button>
        </ProfileUpdateWrap>
      </ProfileMainWrap>
    </ProfileUpdateContainer>
  );
};

export default ProfileUpdatePage;

const ProfileUpdateContainer = styled.section`
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 100%;
`;

// 상단 뒤로가기 고정
const TopBackNavWrap = styled.div`
  width: 100%;
  height: 5rem;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 200;
`;

const ProfileMainWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 5rem);
  padding: 0 2rem;
  overflow-y: auto;
`;

// 프로필 콘텐츠 컨테이너
const ProfileContentWrap = styled.div`
  width: 100%;
  height: 100%;
`;

// 프로필 업데이트 정보
const ProfileWrap = styled.div`
  margin-top: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 4rem;
`;

const CategoryWrap = styled.div`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  > .category-title {
    width: 100%;
    font-size: 13px;
    color: var(--color-dark-gray);
    padding-bottom: 1rem;
  }
`;

// 회원정보 저장 버튼
const ProfileUpdateWrap = styled.div`
  margin-top: 2rem;
  width: 100%;
`;
