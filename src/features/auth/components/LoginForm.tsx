"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login.schema";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("identifier")}
        placeholder="نام کاربری"
      />

      {errors.identifier && (
        <p>{errors.identifier.message}</p>
      )}

      <input
        {...register("password")}
        type="password"
        placeholder="رمز عبور"
      />

      {errors.password && (
        <p>{errors.password.message}</p>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending
          ? "در حال ورود..."
          : "ورود"}
      </button>
    </form>
  );
}