export interface IFeedbackResponse {
  statusCode: number;
  message: string;
  data: IFeedback[];
}

export interface IFeedback {
  id: string;
  category: string;
  description: string;
  location: string;
  phoneNumber: string;
  ticket: string | null;
  galleryImages: string[];
  organizationIds: string[];
  feedbackStatus: 'UNRESOLVED' | 'RESOLVED' | string;
  responseStatus: 'PENDING' | 'ANSWERED' | string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  response: FeedbackResponseItem[];
}

export interface FeedbackResponseItem {
  id: string;
  feedbackId: string;
  subject: string;
  description: string;
  galleryImages: string[];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
}

export interface Organization {
  id: string;
  name: string;
  category: string;
  address: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}
