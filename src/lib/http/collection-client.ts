
import axios from "axios";

import { apiConfig } from "@/config/api-config";
import { attachResponseInterceptor } from "@/lib/http/interceptors";

export const collectionClient = axios.create({
    baseURL: apiConfig.collection.baseURL,
    timeout: apiConfig.collection.timeout,
    headers: {
        "Content-Type": "application/json",
    },
});

attachResponseInterceptor(collectionClient);
