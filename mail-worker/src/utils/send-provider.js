export const SEND_PROVIDERS = ['auto', 'resend', 'cloudflare'];

export function selectSendProvider(preference = 'auto', resendToken, cloudflareBinding) {
	if (!SEND_PROVIDERS.includes(preference)) throw new Error('invalidSendProvider');
	if (preference === 'resend') {
		if (!resendToken) throw new Error('resendNotConfigured');
		return 'resend';
	}
	if (preference === 'cloudflare') {
		if (!cloudflareBinding) throw new Error('cloudflareNotConfigured');
		return 'cloudflare';
	}
	if (resendToken) return 'resend';
	if (cloudflareBinding) return 'cloudflare';
	throw new Error('noSendProvider');
}
