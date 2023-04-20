const domains = [
  'gmail',
  'yahoo',
  'hotmail',
  'outlook',
  'aol',
  'icloud',
  'protonmail',
  'mail',
  'zoho',
  'gmx',
];
const tlds = [
  'com',
  'net',
  'org',
  'edu',
  'gov',
  'co.uk',
  'ca',
  'de',
  'jp',
  'fr',
];

export const generateRandomEmail = (): string => {
  const randomDomain = domains[
    Math.floor(Math.random() * domains.length)
  ] as string;
  const randomTld = tlds[Math.floor(Math.random() * tlds.length)] as string;
  const username = Math.random().toString(36).substring(2, 8);

  return `${username}@${randomDomain}.${randomTld}`;
};
