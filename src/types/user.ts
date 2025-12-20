interface UserProfile {
  id: number;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  websiteUrl?: string | null;
  githubUsername?: string | null;
  linkedinUrl?: string | null;
  googleId?: string | null;
  emailVerified: boolean;
  isPremium: boolean;
  premiumStartedAt: string | Date;
  premiumExpiresAt: string | Date;
  lastLoginAt: string | Date;
  lastActiveAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
