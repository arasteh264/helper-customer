// داده‌ی نمونه. در پروژه‌ی واقعی از API / دیتابیس گرفته شود.
import type { DirectorySpecialist } from "../types/catalog.types";

export const directorySpecialists: DirectorySpecialist[] = [
  { id: "ali-rezaei", name: "علی رضایی", field: "لوله‌کش ساختمان", categoryId: "plumbing", city: "تهران", rating: 4.9, reviews: 312, jobs: 210, startingPrice: 350000, verified: true },
  { id: "hamed-sadeghi", name: "حامد صادقی", field: "لوله‌کش و تأسیسات", categoryId: "plumbing", city: "تهران", rating: 4.8, reviews: 96, jobs: 150, startingPrice: 380000, verified: true },
  { id: "reza-karimi", name: "رضا کریمی", field: "لوله‌کش ساختمان", categoryId: "plumbing", city: "کرج", rating: 4.6, reviews: 54, jobs: 70, startingPrice: 300000, verified: false },
  { id: "sara-ahmadi", name: "سارا احمدی", field: "نقاش و دکوراتور", categoryId: "painting", city: "اصفهان", rating: 4.7, reviews: 128, jobs: 80, startingPrice: 400000, verified: true },
  { id: "amir-karimi", name: "امیر کریمی", field: "نجار و مبلمان سفارشی", categoryId: "carpentry", city: "تبریز", rating: 4.8, reviews: 88, jobs: 55, startingPrice: 450000, verified: true },
  { id: "elham-rostami", name: "الهام رستمی", field: "برقکار ساختمان", categoryId: "electrical", city: "تهران", rating: 4.9, reviews: 140, jobs: 190, startingPrice: 280000, verified: true },
  { id: "mohsen-ghasemi", name: "محسن قاسمی", field: "برقکار صنعتی و ساختمان", categoryId: "electrical", city: "مشهد", rating: 4.5, reviews: 46, jobs: 60, startingPrice: 260000, verified: false },
  { id: "narges-jafari", name: "نرگس جعفری", field: "نظافت منزل و اداری", categoryId: "cleaning", city: "تهران", rating: 4.9, reviews: 402, jobs: 500, startingPrice: 220000, verified: true },
  { id: "bahram-yazdani", name: "بهرام یزدانی", field: "کاشی‌کار و سرامیک‌کار", categoryId: "tiling", city: "تهران", rating: 4.7, reviews: 65, jobs: 90, startingPrice: 500000, verified: true },
  { id: "maryam-hosseini", name: "مریم حسینی", field: "وکیل پایه یک دادگستری", categoryId: "legal", city: "تهران", rating: 4.9, reviews: 96, jobs: 150, startingPrice: 1200000, verified: true },
  { id: "nima-sadeghi", name: "نیما صادقی", field: "طراح UI/UX", categoryId: "tech", city: "شیراز", rating: 4.8, reviews: 74, jobs: 60, startingPrice: 900000, verified: true },
  { id: "pariya-mousavi", name: "پریا موسوی", field: "مدرس خصوصی ریاضی", categoryId: "education", city: "مشهد", rating: 5, reviews: 203, jobs: 340, startingPrice: 300000, verified: true },
  { id: "kaveh-ahmadi", name: "کاوه احمدی", field: "مکانیک خودرو در محل", categoryId: "auto", city: "تهران", rating: 4.6, reviews: 58, jobs: 75, startingPrice: 250000, verified: false },
  { id: "shirin-moradi", name: "شیرین مرادی", field: "عکاس مراسم و محصول", categoryId: "photo", city: "اصفهان", rating: 4.8, reviews: 39, jobs: 45, startingPrice: 700000, verified: true },
];

export const CITIES = ["تهران", "اصفهان", "مشهد", "شیراز", "تبریز", "کرج"];