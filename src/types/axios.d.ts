
import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        requiresAuth?: boolean;
    }

    export interface InternalAxiosRequestConfig {
        requiresAuth?: boolean;
    }
}
