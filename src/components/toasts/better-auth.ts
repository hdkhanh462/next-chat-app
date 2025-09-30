import { toast } from "sonner";

import { getApiErrorDetail, isApiErrorCode } from "@/lib/auth/client";

export default function betterAuthToast(code?: string) {
  if (isApiErrorCode(code)) {
    const errorDetail = getApiErrorDetail(code);
    toast.error(errorDetail.title, {
      description: errorDetail.description,
    });
    return true;
  }
  return false;
}
