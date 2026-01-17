export async function createClient() {
  // Supabase has been fully disabled for this static deployment.
  // This async stub exists only to satisfy any legacy imports.
  return {
    from() {
      return {
        insert: async () => ({ data: null, error: null }),
        select: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null }),
      }
    },
  } as any
}
