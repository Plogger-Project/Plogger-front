// variable: path 상수 //
export const ROOT_PATH = '/';
export const AUTH_PATH = '/auth';

export const RECRUIT_PATH = '/recruit';
export const RECRUIT_DETAIL_PATH = (recruitPostId: string | number) => `${RECRUIT_PATH}/${recruitPostId}`;
// export const RECRUIT_DETAIL_PATH = `${RECRUIT_PATH}/detail`;
export const RECRUIT_WRITE_PATH = `${RECRUIT_PATH}/write`;
// export const RECRUIT_UPDATE_PATH = (recruitPostId: string | number) => `${recruitPostId}/update`;
export const RECRUIT_UPDATE_PATH = `${RECRUIT_PATH}/update`;

export const RECRUIT_MYPAGE_PATH = `/mypage`;

export const SNS_SUCCESS_PATH = '/sns-success';
export const ACTIVE_PATH = '/active';

export const QNA_PATH = '/qna';
export const QNA_WRITE_PATH = `${QNA_PATH}/write`;

export const FIND_ID = '/find-id';
export const FIND_PASSWORD = '/find-password';

export const MYPAGE = '/mypage';

// variable: 절대 경로 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;
export const AUTH_ABSOLUTE_PATH = AUTH_PATH;

export const RECRUIT_ABSOLUTE_PATH = RECRUIT_PATH;
export const QNA_ABSTRACT_PATH = QNA_PATH;

// export const RECRUIT_DETAIL_ABSOLUTE_PATH = (recruitPostId: string | number) => `${RECRUIT_PATH}/${RECRUIT_DETAIL_PATH(recruitPostId)}`;
export const RECRUIT_DETAIL_ABSOLUTE_PATH = RECRUIT_DETAIL_PATH;
export const RECRUIT_WRITE_ABSOLUTE_PATH = RECRUIT_WRITE_PATH;
export const RECRUIT_UPDATE_ABSOLUTE_PATH = `${RECRUIT_UPDATE_PATH}`;

export const QNA_WRITE_ABSOLUTE_PATH = `${QNA_WRITE_PATH}`;

// variable: HTTP BEARER TOKEN COOKIE NAME //
export const ACCESS_TOKEN = 'accessToken';
