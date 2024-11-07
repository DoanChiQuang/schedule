export type TAuth = {
    loading: boolean;
    userInfo: {};
    error: string | null;
    success: boolean;
    isLogged: boolean;
    isSent: boolean;
};

export type TSigninDTO = {
    email: string;
    password: string;
};

export type TSigninData = {
    user: {};
    msg: string;
};

export type TForgotPasswordDTO = {
    email: string;
};

export type TForgotPasswordData = {
    msg: string;
};

export type TResetPasswordDTO = {
    token: string;
    password: string;
};

export type TResetPasswordData = {
    msg: string;
};
