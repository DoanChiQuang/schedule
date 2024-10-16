export type TAuth = {
    loading: boolean;
    userInfo: {};
    error: string | null;
    success: boolean;
    isLogged: boolean;
};

export type TSigninDTO = {
    email: string;
    password: string;
};

export type TSigninData = {
    user: {};
    msg: string;
};
