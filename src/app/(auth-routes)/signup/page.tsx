"use client";

import styles from "./signup.module.css";
import { useState } from "react";
import { z, ZodError } from "zod";
import Image from "next/image";
import Button from "@/components/Button/button";

const schema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
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

  return (
    <div className={styles.signupMain}>
      <Image
        src="/assets/Image.png"
        alt="green image with spirals"
        width="1870"
        height="520"
        layout="responsive"
      />
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
            placeholder="Jane Doe"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <span id="username-error" role="alert">
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
            placeholder="janedoe@gmail.com"
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
        <Button disabled={isSubmitting}>Register</Button>

        {/* {isSubmitting ? "Submitting..." : "Submit"} */}

        <p className={styles.routingMessage}>
          Already have an account?{" "}
          <span className={styles.signInMessage}>Sign in</span>
        </p>
        {submitResult && <p role="status">{submitResult}</p>}
      </form>
    </div>
  );
};

export default SignUp;
