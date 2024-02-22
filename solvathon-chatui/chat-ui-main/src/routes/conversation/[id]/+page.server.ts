import { collections } from "$lib/server/database";
import { ObjectId } from "mongodb";
import { error } from "@sveltejs/kit";
import { UrlDependency } from "$lib/types/UrlDependency";

export const load = async ({ params, depends, locals }) => {
	let conversation;
	let shared = false;

	const oauthSession = await locals.getSession();

	// if the conver
	if (params.id.length === 7) {
		// shared link of length 7
		conversation = await collections.sharedConversations.findOne({
			_id: params.id,
		});
		shared = true;

		if (!conversation) {
			throw error(404, "Conversation not found");
		}
	} else {
		// todo: add validation on params.id
		conversation = await collections.conversations.findOne({
			_id: new ObjectId(params.id),
		});

		depends(UrlDependency.Conversation);

		if (!conversation) {
			throw error(404, "Conversation not found.");
		}

		if (oauthSession?.user?.email !== conversation.email) {
			throw error(
				403,
				"You don't have access to this conversation. If someone gave you this link, ask them to use the 'share' feature instead."
			);
		}
	}
	return {
		messages: conversation.messages,
		title: conversation.title,
		model: conversation.model,
		preprompt: conversation.preprompt,
		shared,
	};
};
