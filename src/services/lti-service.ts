import clientApi from '@/lib/apis/axios-client';
import { ApiResponse, HttpStatus } from '@/types/api';
import { AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

export enum ResourceType {
  PROBLEM = 'PROBLEM',
  CONTEST = 'CONTEST',
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
  resourceId: number,
  type: ResourceType = ResourceType.PROBLEM
): Promise<any> {
  const deviceId = await LtiService.getDeviceId();

  const custom =
    type === ResourceType.PROBLEM
      ? { problemId: resourceId }
      : { contestId: resourceId };

  const deepLinkResponse = {
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
