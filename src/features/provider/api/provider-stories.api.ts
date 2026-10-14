import axios from "axios";
import { apiClient } from "@/src/lib/api/client";
import { ApiError } from "@/src/lib/api/error";

export type ProviderStoryStatus =
  "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";

export interface ProviderStory {
  id: string;
  title: string;
  description?: string;
  specialtyId?: string;
  specialtyName?: string;
  specialtySlug?: string;
  specialtyGroupName?: string;
  overlayText?: string;
  overlayColor: string;
  overlayFontSize: number;
  overlayPositionX: number;
  overlayPositionY: number;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status: ProviderStoryStatus;
  isPaid: boolean;
  priceToman?: number;
  monetizationStatus:
    "FREE" | "PENDING_ADMIN_SETUP" | "PAYMENT_REQUIRED" | "PAID";
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  viewsCount?: number;
  uniqueViewers?: number;
}

export interface ProviderStorySpecialty {
  id: string;
  name: string;
  slug: string;
  groupName: string;
}

export interface StoryOverlay {
  text: string;
  color: string;
  fontSize: number;
  positionX: number;
  positionY: number;
}

export interface ProviderStoryMessage {
  id: string;
  body: string;
  createdAt: string;
  senderUserId: string;
  sender: { id: string; name: string };
}

export interface ProviderStoryConversation {
  id: string;
  story: {
    id: string;
    title: string;
    mediaType: "IMAGE" | "VIDEO";
    thumbnailUrl: string | null;
  };
  customer: { id: string; name: string };
  provider: { id: string; name: string };
  messages: ProviderStoryMessage[];
}

export interface ProviderStoryConversationSummary {
  id: string;
  story: ProviderStoryConversation["story"];
  customer: ProviderStoryConversation["customer"];
  messageCount: number;
  lastMessage: {
    body: string;
    createdAt: string;
    senderUserId: string;
  } | null;
  updatedAt: string;
}

interface StoryUploadSignature {
  cloudName: string;
  apiKey: string;
  uploadUrl: string;
  timestamp: number;
  publicId: string;
  signature: string;
  resourceType: "image" | "video";
  maxSizeMB: number;
}

function getMediaType(file: File): "IMAGE" | "VIDEO" {
  return file.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(file.name)
    ? "VIDEO"
    : "IMAGE";
}

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

function storyBody(
  title: string,
  description: string,
  uploaded?: { publicId: string; mediaType: "IMAGE" | "VIDEO" },
  specialtyId?: string,
  overlay?: StoryOverlay,
) {
  const data: Record<string, string | number> = {
    title,
    description,
    specialtyId: specialtyId ?? "",
  };
  if (uploaded) {
    data.uploadedPublicId = uploaded.publicId;
    data.mediaType = uploaded.mediaType;
  }
  if (overlay) {
    data.overlayText = overlay.text;
    data.overlayColor = overlay.color;
    data.overlayFontSize = overlay.fontSize;
    data.overlayPositionX = overlay.positionX;
    data.overlayPositionY = overlay.positionY;
  }
  return data;
}

async function uploadStoryMedia(
  accessToken: string,
  file: File,
  mediaType: "IMAGE" | "VIDEO",
  onProgress?: (percent: number) => void,
) {
  let signature: StoryUploadSignature;
  try {
    const result = await apiClient<StoryUploadSignature>(
      "/provider/stories/upload-signature",
      {
        method: "POST",
        data: { mediaType },
        headers: authHeaders(accessToken),
      },
    );
    signature = result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(
        `آماده‌سازی بارگذاری در API ناموفق بود (خطای ${error.status ?? "نامشخص"}): ${error.message}`,
      );
    }
    throw error;
  }
  if (file.size > signature.maxSizeMB * 1024 * 1024) {
    throw new Error(
      `حجم فایل باید حداکثر ${signature.maxSizeMB} مگابایت باشد.`,
    );
  }

  const uploadData = new FormData();
  uploadData.set("file", file);
  uploadData.set("api_key", signature.apiKey);
  uploadData.set("timestamp", String(signature.timestamp));
  uploadData.set("public_id", signature.publicId);
  uploadData.set("overwrite", "false");
  uploadData.set("signature", signature.signature);

  try {
    await axios.post(signature.uploadUrl, uploadData, {
      onUploadProgress: (event) => {
        if (event.total) {
          onProgress?.(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseBody = error.response?.data;
      const responseMessage =
        typeof responseBody === "object" &&
        responseBody !== null &&
        "error" in responseBody &&
        typeof responseBody.error === "object" &&
        responseBody.error !== null &&
        "message" in responseBody.error &&
        typeof responseBody.error.message === "string"
          ? responseBody.error.message
          : undefined;
      if (responseMessage) throw new Error(responseMessage);
      if (error.response?.status) {
        throw new Error(
          `بارگذاری رسانه ناموفق بود (خطای ${error.response.status} از سرویس رسانه).`,
        );
      }
      throw new Error(
        `ارتباط با سرویس بارگذاری ${new URL(signature.uploadUrl).host} برقرار نشد. احتمالاً نشانی منطقه‌ای Cloudinary یا محدودیت دسترسی مبدأ در تنظیمات سرویس درست نیست؛ خطای مرورگر: ${error.message}`,
      );
    }
    if (error instanceof Error) throw error;
    throw new Error("بارگذاری رسانه با خطای ناشناخته‌ای متوقف شد.");
  }
  return { publicId: signature.publicId, mediaType };
}

export const providerStoriesApi = {
  async getCustomerStoryMessages(accessToken: string, storyId: string) {
    const { data } = await apiClient<ProviderStoryConversation>(
      `/provider/stories/${storyId}/messages`,
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return data;
  },

  async sendCustomerStoryMessage(
    accessToken: string,
    storyId: string,
    body: string,
  ) {
    const { data } = await apiClient<ProviderStoryMessage>(
      `/provider/stories/${storyId}/messages`,
      { method: "POST", headers: authHeaders(accessToken), data: { body } },
    );
    return data;
  },

  async getStoryConversationMessages(
    accessToken: string,
    conversationId: string,
  ) {
    const { data } = await apiClient<ProviderStoryConversation>(
      `/provider/stories/conversations/${conversationId}/messages`,
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return data;
  },

  async sendStoryConversationMessage(
    accessToken: string,
    conversationId: string,
    body: string,
  ) {
    const { data } = await apiClient<ProviderStoryMessage>(
      `/provider/stories/conversations/${conversationId}/messages`,
      { method: "POST", headers: authHeaders(accessToken), data: { body } },
    );
    return data;
  },

  async listStoryConversations(accessToken: string) {
    const { data } = await apiClient<ProviderStoryConversationSummary[]>(
      "/provider/stories/conversations",
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return data;
  },

  async list(accessToken: string) {
    const pageSize = 50;
    const getPage = async (page: number) => {
      const { data } = await apiClient<{
        stories: ProviderStory[];
        availableSpecialties: ProviderStorySpecialty[];
        videoMaxSizeMB: number;
        canCreateStory: boolean;
        total: number;
        page: number;
        pageSize: number;
      }>(`/provider/stories?page=${page}&pageSize=${pageSize}`, {
        method: "GET",
        headers: authHeaders(accessToken),
      });
      return data;
    };

    const firstPage = await getPage(1);
    const pageCount = Math.ceil(firstPage.total / firstPage.pageSize);
    const stories = [...firstPage.stories];
    for (let start = 2; start <= pageCount; start += 5) {
      const pages = await Promise.all(
        Array.from({ length: Math.min(5, pageCount - start + 1) }, (_, index) =>
          getPage(start + index),
        ),
      );
      stories.push(...pages.flatMap((page) => page.stories));
    }

    return { ...firstPage, stories };
  },

  async create(
    accessToken: string,
    title: string,
    description: string,
    file: File,
    specialtyId?: string,
    overlay?: StoryOverlay,
    onProgress?: (percent: number) => void,
  ) {
    const mediaType = getMediaType(file);
    const uploaded = await uploadStoryMedia(
      accessToken,
      file,
      mediaType,
      onProgress,
    );
    try {
      const { data } = await apiClient<ProviderStory>("/provider/stories", {
        method: "POST",
        data: storyBody(title, description, uploaded, specialtyId, overlay),
        headers: authHeaders(accessToken),
      });
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(
          `فایل بارگذاری شد، اما ثبت داستان در API ناموفق بود (خطای ${error.status ?? "نامشخص"}): ${error.message}`,
        );
      }
      throw error;
    }
  },

  async update(
    accessToken: string,
    storyId: string,
    title: string,
    description: string,
    file?: File,
    specialtyId?: string,
    overlay?: StoryOverlay,
    onProgress?: (percent: number) => void,
  ) {
    const mediaType = file ? getMediaType(file) : undefined;
    const uploaded = file
      ? await uploadStoryMedia(accessToken, file, mediaType!, onProgress)
      : undefined;
    try {
      const { data } = await apiClient<ProviderStory>(
        `/provider/stories/${storyId}`,
        {
          method: "PATCH",
          data: storyBody(title, description, uploaded, specialtyId, overlay),
          headers: authHeaders(accessToken),
        },
      );
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(
          `فایل بارگذاری شد، اما ذخیره‌ی ویرایش در API ناموفق بود (خطای ${error.status ?? "نامشخص"}): ${error.message}`,
        );
      }
      throw error;
    }
  },

  async submit(accessToken: string, storyId: string) {
    const { data } = await apiClient<ProviderStory>(
      `/provider/stories/${storyId}/submit`,
      { method: "POST", headers: authHeaders(accessToken) },
    );
    return data;
  },

  async pay(accessToken: string, storyId: string) {
    const { data } = await apiClient<{ paid: true; balance: number }>(
      `/provider/stories/${storyId}/pay`,
      { method: "POST", headers: authHeaders(accessToken) },
    );
    return data;
  },

  async getStats(accessToken: string, storyId: string) {
    const { data } = await apiClient<{
      viewsCount: number;
      uniqueViewers: number;
      lastUpdatedAt: string;
    }>(`/provider/stories/${storyId}/stats`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return data;
  },

  delete(accessToken: string, storyId: string) {
    return apiClient(`/provider/stories/${storyId}`, {
      method: "DELETE",
      headers: authHeaders(accessToken),
    });
  },
};
