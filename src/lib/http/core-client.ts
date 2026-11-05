
import axios from "axios";

import { apiConfig } from "@/config/api-config";
import {
    attachCoreAuthInterceptor,
    attachResponseInterceptor,
} from "@/lib/http/interceptors";

export const coreClient = axios.create({
    baseURL: apiConfig.core.baseURL,
    timeout: apiConfig.core.timeout,
    headers: {
        "Content-Type": "application/json",
    },
});

attachCoreAuthInterceptor(coreClient);
attachResponseInterceptor(coreClient);
