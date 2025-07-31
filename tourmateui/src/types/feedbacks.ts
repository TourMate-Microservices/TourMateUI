export type Feedback = {
    feedbackId: number,
    image: string,
    fullName: string,
    customerId: number,
    date: string,
    rating: number,
    invoiceId: number,
    content: string,
    createdDate: string,
    serviceId: number,
    serviceName: string
}

export interface CreateTourFeedback {
  content: string;
  customerId: number;
  invoiceId: number;
  rating: number;
  serviceId: number;
  tourGuideId: number;
}

export interface UpdateFeedbackRequest {
  actorId: number;
  feedbackId: number;
}

export interface UpdateFeedback {
  content: string;
  rating: number;
  request: UpdateFeedbackRequest;
}
