export type ICreateAccount = {
    name: string;
    email: string;
    otp: number;
};

export type IResetPassword = {
    email: string;
    otp: number;
};


export type IAdminApproval = {
    name: string;
    email: string;
    isAdminVerified: boolean
};
