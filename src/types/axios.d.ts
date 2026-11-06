import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        requiresAuth?: boolean;
        requiresPaymentAuth?: boolean;
    }

    export interface InternalAxiosRequestConfig {
        requiresAuth?: boolean;
        requiresPaymentAuth?: boolean;
    }
}