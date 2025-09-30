import clientApi from "@/lib/apis/axios-client";
import { getSession } from "next-auth/react";

export class LtiService {

  private static async getDeviceId(): Promise<string> {
    if (typeof window !== 'undefined') {
      const session = await getSession();
      return session?.deviceId || '';
    }
    return '';
  }


  // Send deep linking response
  static async sendDeepLinkingResponse(problemId: string): Promise<any> {
    try {
      const url = process.env.NEXT_PUBLIC_API_LAUNCH_URL;
      const deviceId = await this.getDeviceId();

      console.log(deviceId);

      const deepLinkResponse = {
        url,
        deviceId,
        custom: {
          problemId,
        },
      };

      const response = await clientApi.post(
        "/lti/dl/response",
        deepLinkResponse,
        { withCredentials: true, responseType: "text" }
      );

      const html = response.data;
      console.log("Deep linking response HTML:", html);

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Lấy form ra
      const form = doc.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error("Error sending deep linking response:", error);
      throw error;
    }
  }
}