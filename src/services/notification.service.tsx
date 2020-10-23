import { Notification } from '../commons/components';

export class NotificationService {
  private static _notification: any;

  static initialize(): void {
    Notification.prototype.newInstance({}, (n: any) => (this._notification = n));
  }

  static notify(message: string): void {
    this._notification.notice({
      content: message
    });
  }
}
