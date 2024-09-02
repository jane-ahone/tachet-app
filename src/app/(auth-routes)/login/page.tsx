"use client";

import styles from "./login.module.css";
import { useState } from "react";
import { z, ZodError } from "zod";
import Image from "next/image";
import Button from "@/components/Button/button";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    const result = schema.safeParse(formData);

    if (!result.success) {
      console.log("Validation failed:");
      console.log(result.error.errors); // Access the list of errors
      for (let error in result.error.errors) {
        // console.log(error.code);
      }
    } else {
      console.log("Validation succeeded:", result.data);
    }

    setIsSubmitting(false);
    // const inputValidation = schema.parse(formData);
    // console.log(inputValidation);
    // try {

    //   // Send data to API route
    //   const response = await fetch("/api/contact", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(formData),
    //   });

    //   if (response.ok) {
    //     setSubmitResult("Form submitted successfully!");
    //     setFormData({ username: "", email: "", password: "" });
    //   } else {
    //     const error = await response.json();
    //     setSubmitResult(`Submission failed: ${error.password}`);
    //   }
    // } catch (error) {
    //   if (error instanceof z.ZodError) {
    //     const newErrors = {};
    //     error.errors.forEach((err) => {
    //       newErrors[err.path[0]] = err.password;
    //     });
    //     setErrors(newErrors);
    //   } else {
    //     setSubmitResult("An unexpected error occurred");
    //   }
    // } finally {
    //   setIsSubmitting(false);
    // }
  };
  const handleInput = async () => {
    const username = "JohnDoe";
    const password = "123456789";
    const email = "john@example.com";

    const response = await fetch("http://localhost:3000/api/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();
    console.log(data);
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
          <Button disabled={isSubmitting} className={styles.button}>
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
      <Image
        src="/assets/loginImage.png"
        alt="green image with spirals"
        width="1870"
        height="520"
        layout="responsive"
      />
    </div>
  );
};

export default Login;
