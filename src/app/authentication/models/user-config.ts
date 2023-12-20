import { EmailNotificationTypes } from "./email-notification-types";

export interface UserConfig {
    _id?: string;
    uid: string;
    notifications: Record<EmailNotificationTypes, boolean>;
}
