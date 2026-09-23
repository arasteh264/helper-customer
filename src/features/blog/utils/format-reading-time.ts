import { toPersianDigits } from "@/src/utils/format";

export const formatReadingTime = (minutes: number) => `${toPersianDigits(minutes)} دقیقه مطالعه`;