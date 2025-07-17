export const NODE_LIMIT = +(process.env.NEXT_PUBLIC_NODE_LIMIT as string) || 1000;
export const FILE_SIZE_LIMIT_BYTES =
  (+(process.env.NEXT_PUBLIC_FILE_SIZE_LIMIT_MB as string) || 5) * 1024 * 1024;
