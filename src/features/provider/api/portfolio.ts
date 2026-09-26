"use client";
import { apiClient } from "@/src/lib/api/client";

export interface PortfolioImage {
  id: string;
  url: string;
}

export interface PortfolioItemDto {
  id: string;
  title: string;
  description: string;
  images: PortfolioImage[];
}

const authHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export async function getPortfolioItems(
  accessToken?: string,
): Promise<PortfolioItemDto[]> {
  const { data } = await apiClient.get<PortfolioItemDto[]>(
    "/providers/profile/portfolio",
    {
      headers: authHeaders(accessToken),
    },
  );
  return data;
}

export async function createPortfolioItem(
  input: {
    files: File[];
    title: string;
    description: string;
  },
  token?: string
): Promise<PortfolioItemDto> {
  const formData = new FormData();
  input.files.forEach((file) => formData.append("files", file));
  formData.append("title", input.title);
  formData.append("description", input.description);

  const { data } = await apiClient.post<PortfolioItemDto>(
    "/providers/profile/portfolio",
    formData,
    {
      headers: {
        "Content-Type": undefined,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  return data;
}

export async function addImageToItem(
  itemId: string,
  file: File,
  accessToken?: string,
): Promise<PortfolioImage> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<PortfolioImage>(
    `/providers/profile/portfolio/${itemId}/images`,
    formData,
    {
      headers: {
        "Content-Type": undefined,
        ...(authHeaders(accessToken) ?? {}),
      },
    },
  );
  return data;
}
export async function deleteImage(
  itemId: string,
  imageId: string,
  accessToken?: string,
): Promise<void> {
  await apiClient.delete(
    `/providers/profile/portfolio/${itemId}/images/${imageId}`,
    {
      headers: authHeaders(accessToken),
    },
  );
}

export async function deletePortfolioItem(
  itemId: string,
  accessToken?: string,
): Promise<void> {
  await apiClient.delete(`/providers/profile/portfolio/${itemId}`, {
    headers: authHeaders(accessToken),
  });
}
