import clientApi from '@/lib/apis/axios-client';
import { getSession } from 'next-auth/react';

export enum ResourceType {
  PROBLEM_MANAGEMENT = 'problem-management',
  CONTEST = 'contest',
}

async function getDeviceId(): Promise<string> {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    return session?.deviceId || '';
  }
  return '';
}

// Send deep linking response
async function sendDeepLinkingResponse(
  type: ResourceType = ResourceType.CONTEST,
  resourceId?: number
): Promise<any> {
  const deviceId = await LtiService.getDeviceId();

  let custom: Record<string, any> = {};
  switch (type) {
    case ResourceType.CONTEST:
      custom = { contestId: resourceId };
      break;
    case ResourceType.PROBLEM_MANAGEMENT:
      custom = {};
      break;
    default:
      break;
  }

  const deepLinkResponse = {
    contentType: type,
    deviceId,
    custom,
  };

  const response = await clientApi.post('/lti/dl/response', deepLinkResponse, {
    withCredentials: true,
    responseType: 'text',
  });

  if (response.status === 201) {
    const html = response.data;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const form = doc.querySelector('form');
    if (form) {
      document.body.appendChild(form);
      form.submit();
    }
  }
  return response;
}

export const LtiService = {
  getDeviceId,
  sendDeepLinkingResponse,
};
