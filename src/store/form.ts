import { PATH } from '@/routes/path';
import { atom } from 'jotai';

/**
 * (11/28)
 * 새로운 시도로 컴포넌트와 상태를 매핑해서 재사용 해보기로 했다. (CommonTextInput, CommonTextarea, ComonImageInput)
 * 스타일, 상태, 로직 코드를 최대한 분리시키고 싶다.
 * 폼 값을 언제 클린업 해야할 지? 계속 유지하며 사용하고 싶다.
 * 현재 매핑된 상태는 프로필 생성, 팀 생성, 팀 정보 변경에서 공유된다.
 * 폼 값을 비워야 하는 경우는 다음과 같다.
 * 1. 프로필 -> 팀
 * 2. 팀 -> 프로필
 *
 * (11/29)
 * 프로필, 팀 전용 상태를 내부에서 나누긴 했다.
 * 그런데 현재 경로를 기준으로 나누는데, popstate, pushstate의 event listener에 setPath를 넣어서 바꿔도 경로가 바뀐게 감지가 안된다
 * 그래서 currentPathAtom을 따로 만들어서 SingleSectionLayout에서만 useEffect를 통해 setPath 실행
 * 어차피 form은 SingleSectionLayout에만 있으니까 상관없는 페이지에서 useEffect가 돌지는 않지만,
 * 결국 상태를 나눠야 하는데, 차라리 컴포넌트를 두 개 만들던가, value, setValue를 프롭스로 받아오는게 낫지 않을까 고민중
 * 어떤 비용이 더 적을지 잘 모르겠다. value, setValue를 프롭스로 받아오는게 제일 나아 보이긴 함
 */

/*
    Form
 */
export const currentPathAtom = atom<string>(window.location.pathname);
const userForm = [PATH.ENROLL, PATH.PROFILE];
const isOnUserFormAtom = atom((get) => get(currentPathAtom) in userForm);

const userNameStorageAtom = atom<string>('');
const teamNameStorageAtom = atom<string>('');

export const formTextInputAtom = atom(
  (get) => {
    return get(isOnUserFormAtom)
      ? get(userNameStorageAtom)
      : get(teamNameStorageAtom);
  },
  (get, set, newValue: string) => {
    set(
      get(isOnUserFormAtom) ? userNameStorageAtom : teamNameStorageAtom,
      newValue
    );
  }
);

const userDescStorageAtom = atom<string>('');
const teamDescStorageAtom = atom<string>('');

export const formTextareaAtom = atom(
  (get) => {
    return get(isOnUserFormAtom)
      ? get(userDescStorageAtom)
      : get(teamDescStorageAtom);
  },
  (get, set, newValue: string) => {
    set(
      get(isOnUserFormAtom) ? userDescStorageAtom : teamDescStorageAtom,
      newValue
    );
  }
);

const userPictureStorageAtom = atom<File | null>(null);
const teamPictureStorageAtom = atom<File | null>(null);

export const MAX_IMAGE_SIZE = 10;
export const isImageFitAtom = atom<boolean | null>(null);
export const imageAtom = atom(
  (get) =>
    get(isOnUserFormAtom)
      ? get(userPictureStorageAtom)
      : get(teamPictureStorageAtom),
  (get, set, file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > MAX_IMAGE_SIZE) {
      set(isImageFitAtom, false);
      return;
    } else {
      set(isImageFitAtom, true);
    }

    set(
      get(isOnUserFormAtom) ? userPictureStorageAtom : teamPictureStorageAtom,
      file
    );
  }
);

/*
    Enroll
 */
export const isEnrollAgreementCheckedAtom = atom<boolean>(false);
export const isEnrollSatisfiedAtom = atom<boolean>((get) => {
  const name = get(formTextInputAtom);
  const introduction = get(formTextareaAtom);
  const isAgreed = get(isEnrollAgreementCheckedAtom);

  return name.trim().length > 0 && introduction.trim().length > 0 && isAgreed;
});

/*
    Team
 */
const peopleNumStorageAtom = atom<number | string>('');
export const MAX_PEOPLE_NUM = 20;
export const teamMaxNumAtom = atom(
  (get) => get(peopleNumStorageAtom),
  (_get, set, newValue: number) => {
    if (newValue > 0 && newValue <= MAX_PEOPLE_NUM) {
      set(peopleNumStorageAtom, newValue);
    }
  }
);

export const teamSubjectAtom = atom<string>('');

const passwordStorageAtom = atom<string>('');
export const PROPER_PASSWORD_LENGTH = 4;
export const teamPasswordAtom = atom(
  (get) => get(passwordStorageAtom),
  (_get, set, newValue: string) => {
    if (/^\d*$/.test(newValue) && newValue.length <= PROPER_PASSWORD_LENGTH) {
      set(passwordStorageAtom, newValue);
      return;
    }
  }
);

export const isTeamRegistrationValidAtom = atom<boolean>((get) => {
  const name = get(formTextInputAtom);
  const desc = get(formTextareaAtom);
  const num = get(peopleNumStorageAtom);
  const subject = get(teamSubjectAtom);
  const password = get(passwordStorageAtom);

  return (
    name.trim().length > 0 &&
    desc.trim().length > 0 &&
    Number.isInteger(num) &&
    (num as number) <= MAX_PEOPLE_NUM &&
    subject !== '' &&
    /^\d*$/.test(password) &&
    password.length === 4
  );
});
