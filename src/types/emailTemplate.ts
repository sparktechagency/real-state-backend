export type ICreateAccount = {
    name: string;
    email: string;
    otp: string;
};

export type IResetPassword = {
    email: string;
    otp: string;
};


export type IAdminApproval = {
    name: string;
    email: string;
    isAdminVerified: boolean
};
