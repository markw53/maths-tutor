import emailjs from "@emailjs/browser";
import { toast } from "sonner"; // your existing Toaster library

// Define a stricter payload type: simple string‑keyed values
export interface EmailPayload {
  [key: string]: string | number | boolean;
}

/**
 * Send a form element through EmailJS.
 * Shows toast notifications for success or failure.
 */
export async function sendEmail(form: HTMLFormElement): Promise<boolean> {
  try {
    const result = await emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log("EmailJS success:", result.status, result.text);
    toast.success("Message sent successfully ✅");
    return true;
  } catch (error) {
    console.error("EmailJS error:", error);
    toast.error("Failed to send message ❌");
    return false;
  }
}

/**
 * Send a plain JavaScript object (for HookForm or custom state).
 * Also displays toast feedback.
 */
export async function sendEmailData(data: EmailPayload): Promise<boolean> {
  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      data,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log("EmailJS success:", result.status, result.text);
    toast.success("Message sent successfully ✅");
    return true;
  } catch (error) {
    console.error("EmailJS error:", error);
    toast.error("Failed to send message ❌");
    return false;
  }
}