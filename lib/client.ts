export function createClient() {
	// Supabase has been disabled for this static deployment.
	// This stub exists only so existing imports do not break.
	const noopClient: any = {
		from() {
			return {
				insert: async () => ({ data: null, error: null }),
				select: async () => ({ data: null, error: null }),
				update: async () => ({ data: null, error: null }),
				delete: async () => ({ data: null, error: null }),
			}
		},
	}

	return noopClient
}
