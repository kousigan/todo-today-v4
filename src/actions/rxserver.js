import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject();

export const messageService = {
  sendMessage: message => {
    subject.next(message);
  },
  clearMessages: () => subject.next(),
  onMessage: () => subject.asObservable()
};
