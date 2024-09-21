"use client";

import styles from "./login.module.css";
import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import Button from "@/components/Button/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be under 100 charcters"),
});

type User = z.infer<typeof schema>;
type FieldName = keyof User;

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as FieldName;

    // Update formData
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Form field validation
    const fieldValidation = z.object({
      [fieldName]: schema.shape[fieldName],
    });

    const result = fieldValidation.safeParse({ [fieldName]: value });
    if (!result.success) {
      let newErrors: Record<string, string> = {};
      newErrors[result.error?.issues[0].path[0]] =
        result.error?.issues[0].message;
      setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    const result = schema.safeParse(formData);

    if (!result.success) {
      let newErrors: Record<string, string> = {};

      result.error.errors.map((error) => {
        newErrors[error.path[0]] = error.message;
      });
    } else {
      // Send data to API route
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        console.log(await response.json());
        if (response.ok) {
          setSubmitResult("Form submitted successfully!");
          router.push("/");
        }
      } catch (error) {
        setSubmitResult(`Submission failed: ${error}`);
        setFormData({ email: "", password: "" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.loginMain}>
      <div className={styles.mainLeft}>
        <Image
          className={styles.logo}
          src="/assets/tachet-logo 2.svg"
          alt="logo"
          width={150}
          height={100}
        ></Image>
        <form onSubmit={handleSubmit} noValidate className={styles.loginForm}>
          <p className={styles.heading}>Welcome Back</p>
          <p className={styles.subheading}>
            Enter your email and password to sign in
          </p>

          <div>
            <label className={styles.inputLabel} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              placeholder="Your email"
              required
            />
            {errors.email && (
              <span id="email-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          <div>
            <label className={styles.inputLabel} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <span id="password-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>
          <Button
            type="submit"
            disabled={Object.values(errors).length != 0 ? true : false}
            className={styles.button}
          >
            SIGN IN
          </Button>
          <p className={styles.routingMessage}>
            Don&apos;t have an account yet?{" "}
            <Link href="\signup">
              <span className={styles.loginMessage}>Sign up</span>
            </Link>
          </p>
          {submitResult && <p role="status">{submitResult}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
