import apiInstance from '@/api/apiInstance';

export const kakaoOauth2LoginUrl = `/oauth2/authorization/kakao`;

type CreateProfileArgs = {
  memberName: string;
  image: File | null;
  memberExplain: string;
};

export const createProfile = async ({
  memberName,
  memberExplain,
  image,
}: CreateProfileArgs) => {
  const formData = new FormData();

  formData.append('memberName', memberName);
  formData.append('memberExplain', memberExplain);
  // formData.append(
  //   'memberName',
  //   new Blob([memberName], {
  //     type: 'application/json',
  //   })
  // );
  // formData.append(
  //   'memberExplain',
  //   new Blob([memberExplain], {
  //     type: 'application/json',
  //   })
  // );
  if (image) {
    formData.append('image', image);
  }

  console.log('image', image);

  const res = await apiInstance.post('v1/members', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};
