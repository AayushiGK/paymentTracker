export const emailValidator = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};
