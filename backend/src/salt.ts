import { createHash } from 'crypto';

export const salt = createHash('sha256').update('trevor and seth').digest();
