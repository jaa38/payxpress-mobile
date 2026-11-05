
import axios from "axios";

import { apiConfig } from "@/config/api-config";
import { attachResponseInterceptor } from "@/lib/http/interceptors";

export const collectionStagingClient = axios.create({
    baseURL: apiConfig.collectionStaging.baseURL,
    timeout: apiConfig.collectionStaging.timeout,
    headers: {
        "Content-Type": "application/json",
    },
});

attachResponseInterceptor(collectionStagingClient);
