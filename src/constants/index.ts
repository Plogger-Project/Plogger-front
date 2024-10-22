// variable: path 상수 //
export const ROOT_PATH = '/';
export const AUTH_PATH = '/auth';

export const RECRUIT_PATH = '/recruit';
export const RECRUIT_WRITE_PATH = 'write';
// export const RECRUIT_DETAIL_PATH = (recruitPostId: string | number) => `${recruitPostId}`;
export const RECRUIT_DETAIL_PATH = `${RECRUIT_PATH}/detail`;
export const RECRUIT_UPDATE_PATH = (recruitPostId: string | number) => `${recruitPostId}/update`;

export const ACTIVE_PATH = '/active';

export const QNA_PATH = '/qna';



// variable: 절대 경로 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;
export const AUTH_ABSOLUTE_PATH = AUTH_PATH;
export const RECRUIT_ABSOLUTE_PATH = RECRUIT_PATH;

export const RECRUIT_DETAIL_ABSOLUTE_PATH = `${RECRUIT_PATH}/${RECRUIT_DETAIL_PATH}`;
export const RECRUIT_UPDATE_ABSOLUTE_PATH = `${RECRUIT_PATH}/${RECRUIT_UPDATE_PATH}`;

