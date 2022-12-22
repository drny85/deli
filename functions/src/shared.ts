import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const assignUserType = async (uid: string, type: string) => {
	if (!uid)
		throw new functions.https.HttpsError(
			'aborted',
			'error assigning user type',
			'no uid provided'
		);
	try {
		const user = await admin.auth().getUser(uid);
		if (!user) return;

		return await admin.auth().setCustomUserClaims(user.uid, {
			type: type,
		});
	} catch (error) {
		const err = error as any;
		throw new functions.https.HttpsError(
			'aborted',
			'error assigning user type',
			err.message
		);
	}
};
