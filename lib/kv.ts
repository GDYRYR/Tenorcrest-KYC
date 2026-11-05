import { kv } from "@vercel/kv";

export type KYCSubmission = {
  id: string;
  fullName: string;
  dob: string;
  address: string;
  phone: string;
  country: string;
  city: string;
  nextOfKin: string;
  photo: string; // base64 data URL
  signature: string; // base64 data URL
  submittedAt: string;
};

const KEY_PREFIX = "kyc:submission:";
const LIST_KEY = "kyc:submissions";

export async function saveSubmission(data: Omit<KYCSubmission, "id" | "submittedAt">) {
  const id = crypto.randomUUID();
  const submission: KYCSubmission = {
    ...data,
    id,
    submittedAt: new Date().toISOString(),
  };

  await kv.set(`${KEY_PREFIX}${id}`, submission);
  await kv.lpush(LIST_KEY, id);
  return submission;
}

export async function getAllSubmissions(): Promise<KYCSubmission[]> {
  const ids = (await kv.lrange<string>(LIST_KEY, 0, -1)) || [];
  if (ids.length === 0) return [];

  const submissions = await Promise.all(
    ids.map(async (id) => {
      const item = await kv.get<KYCSubmission>(`${KEY_PREFIX}${id}`);
      return item;
    })
  );

  return submissions.filter((s): s is KYCSubmission => s !== null);
}

export async function getSubmission(id: string): Promise<KYCSubmission | null> {
  return kv.get<KYCSubmission>(`${KEY_PREFIX}${id}`);
}
