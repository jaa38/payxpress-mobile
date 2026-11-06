import axios from "axios";

import { apiConfig } from "@/config/api-config";
import {
    attachPaymentAuthInterceptor,
    attachResponseInterceptor,
} from "@/lib/http/interceptors";

export const paymentClient = axios.create({
    baseURL: apiConfig.payment.baseURL,
    timeout: apiConfig.payment.timeout,
    headers: {
        "Content-Type": "application/json",
    },
});

attachPaymentAuthInterceptor(paymentClient);
attachResponseInterceptor(paymentClient);