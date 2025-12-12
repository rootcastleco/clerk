/**
 * Clerk
 * Developed by Batuhan Ayrıbaş in the Rootcastle ecosystem.
 */

export type Relationship = 'customer' | 'friend' | 'coworker' | 'boss' | 'public' | 'other';
export type Tone = 'friendly' | 'formal' | 'urgent' | 'apologetic' | 'salesy' | 'neutral' | 'other';
export type Platform = 'email' | 'sms' | 'whatsapp' | 'telegram' | 'slack' | 'discord' | 'linkedin_dm' | 'x_dm';

export interface Recipient {
  name: string;
  handle_or_address: string;
}

export interface TargetConstraint {
  max_chars: number;
  allow_emojis: boolean;
  allow_markdown: boolean;
  allow_links: boolean;
}

export interface Target {
  id: string; // Internal UI ID
  platform: Platform;
  recipient: Recipient;
  constraints: TargetConstraint;
}

export interface MessageContext {
  topic: string;
  key_points: string[];
  must_include: string[];
  must_avoid: string[];
  links: string[];
  dates_times: string[];
}

export interface Audience {
  relationship: Relationship;
  language: string;
  tone: Tone;
}

export interface UserPreferences {
  sign_off: string;
  brand_voice_notes: string;
}

export interface ClerkInput {
  user_goal: string;
  audience: Audience;
  message_context: MessageContext;
  targets: Omit<Target, 'id'>[]; // Remove internal ID for API
  draft?: string;
  user_preferences: UserPreferences;
}

// -- API Response Types --

export interface SendPayload {
  platform: string;
  to: string;
  subject: string;
  text: string;
}

export interface MessageVariant {
  platform: string;
  recipient: { name: string; handle_or_address: string };
  subject: string;
  body: string;
  char_count: number;
  send_payload: SendPayload;
}

export interface QualityChecks {
  intent_preserved: boolean;
  platform_fit: boolean;
  no_private_data_leak: boolean;
}

export interface ClerkResponse {
  clarifying_questions: string[];
  assumptions: string[];
  message_variants: MessageVariant[];
  safety_notes: string[];
  quality_checks: QualityChecks;
}