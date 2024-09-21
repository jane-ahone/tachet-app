"use client";

import styles from "./signup.module.css";
import { useState } from "react";
import { z } from "zod";
import Button from "@/components/Button/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fieldSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be under 100 charcters"),
});

type User = z.infer<typeof fieldSchema>;
type FieldName = keyof User;

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<User>>({});
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
      [fieldName]: fieldSchema.shape[fieldName],
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    const result = fieldSchema.safeParse(formData);

    if (!result.success) {
      let newErrors: Record<string, string> = {};

      result.error.errors.map((error) => {
        const fieldName = error.path[0];
        const errorMsg = error.message;
        newErrors[fieldName] = errorMsg;
      });
      setErrors(newErrors);
    } else {
      //Sending form to backend
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setFormData({ username: "", email: "", password: "" });
          router.push("/login");
        } else {
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            newErrors[err.path[0]] = err.message;
          });
          setErrors(newErrors);
        } else {
          console.log(error);
          setSubmitResult("An unexpected error occurred");
        }
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.signupMain}>
      {/* <Image
        src="/assets/Image.png"
        alt="green image with spirals"
        width="1870"
        height="520"
        layout="responsive"
      /> */}
      <form onSubmit={handleSubmit} noValidate className={styles.signupForm}>
        <div className={styles.heading}>Register</div>
        <div>
          <label className={styles.inputLabel} htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            minLength={3}
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <span id="username-error" className="error" role="alert">
              {errors.username}
            </span>
          )}
        </div>
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
            required
          />
          {errors.email && (
            <span id="email-error" className="error" role="alert">
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
            minLength={8}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <span id="password-error" className="error" role="alert">
              {errors.password}
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={Object.values(errors).length != 0 ? true : false}
        >
          Register
        </Button>

        {/* {isSubmitting ? "Submitting..." : "Submit"} */}
        {submitResult && <p role="status">{submitResult}</p>}

        <p className={styles.routingMessage}>
          Already have an account?{" "}
          <Link href="\login">
            <span className={styles.signInMessage}>Sign in</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
