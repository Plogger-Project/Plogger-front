// variable: path 상수 //
export const ROOT_PATH = '/';
export const AUTH_PATH = '/auth';

// 회원가입 //
export const SIGN_UP_PATH = '/sign-up';

export const RECRUIT_PATH = '/recruit';
export const RECRUIT_DETAIL_PATH = (recruitPostId: string | number) => `${RECRUIT_PATH}/${recruitPostId}`;
// export const RECRUIT_DETAIL_PATH = `${RECRUIT_PATH}/detail`;
export const RECRUIT_WRITE_PATH = `${RECRUIT_PATH}/write`;
export const RECRUIT_UPDATE_PATH = (recruitPostId: string | number) => `${RECRUIT_PATH}/${recruitPostId}/update`;

export const RECRUIT_MYPAGE_PATH = `/mypage`;


// 활동 게시판 관련 상수 //
export const ACTIVE_PATH = '/active';
export const ACTIVE_DETAIL_PATH = (activePostId: string | number) => `${ACTIVE_PATH}/${activePostId}`;
export const ACTIVE_UPDATE_PATH = (activePostId: string | number) => `${ACTIVE_PATH}/${activePostId}/update`;
export const ACTIVE_WRITE_PATH = `${ACTIVE_PATH}/write`;

export const SNS_SUCCESS_PATH = '/sns-success';

export const QNA_PATH = '/qna';
export const QNA_DETAIL_PATH = (qnaPostId: string | number) => `${QNA_PATH}/${qnaPostId}`;
export const QNA_UPDATE_PATH = (qnaPostId: string | number) => `${QNA_PATH}/${qnaPostId}/update`;
export const QNA_WRITE_PATH = `${QNA_PATH}/write`;

export const FIND_ID = '/find-id';
export const FIND_PASSWORD = '/find-password';

export const MYPAGE_PATH = (userId: string) => `/mypage/${userId}`;
export const MYPAGE_UPDATE_PATH = '/mypage/update';
export const GIFTICON_PATH = '/mileage';

export const ADMIN = '/admin';

// variable: 절대 경로 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;
export const ACTIVE_ABSOLUTE_PATH = ACTIVE_PATH;
export const AUTH_ABSOLUTE_PATH = AUTH_PATH;

export const RECRUIT_ABSOLUTE_PATH = RECRUIT_PATH;
export const QNA_ABSOLUTE_PATH = QNA_PATH;

// export const RECRUIT_DETAIL_ABSOLUTE_PATH = (recruitPostId: string | number) => `${RECRUIT_PATH}/${RECRUIT_DETAIL_PATH(recruitPostId)}`;
export const RECRUIT_DETAIL_ABSOLUTE_PATH = RECRUIT_DETAIL_PATH;
export const RECRUIT_WRITE_ABSOLUTE_PATH = RECRUIT_WRITE_PATH;
export const RECRUIT_UPDATE_ABSOLUTE_PATH = RECRUIT_UPDATE_PATH;

export const ACTIVE_DETAIL_ABSOLUTE_PATE = ACTIVE_DETAIL_PATH;

export const QNA_DETAIL_ABSOLUTE_PATH = QNA_DETAIL_PATH;
export const QNA_WRITE_ABSOLUTE_PATH = QNA_WRITE_PATH;

export const CHAT_PATH = '/chat';
export const CHAT_DETAIL_PATH = (roomId: string | number) => `${CHAT_PATH}/${roomId}`;

// variable: HTTP BEARER TOKEN COOKIE NAME //
export const ACCESS_TOKEN = 'accessToken';
