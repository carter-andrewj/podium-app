import { observable, computed } from 'mobx';

import { List, Map } from 'immutable';

import Entity from './entity';
import User from './user';
import ReplyIndex from './indexes/replyIndex';
import ReactionIndex from './indexes/reactionIndex';
import PromotionIndex from './indexes/promotionIndex';

import { placeholder } from './utils';
import { formatAge, formatDate, formatTime } from '../../utils/utils';



class Post extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Post"

		// Methods
		this.contentFor = this.contentFor.bind(this)

	}




// POST

	@computed
	@placeholder("")
	get text() {
		return this.state.get("text")
	}

	@computed
	@placeholder(undefined)
	get currency() {
		return this.state.get("currency").toLowerCase()
	}

	@computed
	@placeholder({})
	get cost() {
		let out = {}
		if (this.currency) out[this.currency] = this.state.get("cost")
		return out
	}



// REACTIONS

	@computed
	@placeholder(ReactionIndex)
	get reactions() {
		return this.nation.get("Reactions", this.attributes.get("Reactions"))
	}

	@computed
	@placeholder(null)
	get reacted() {
		return this.reactions.has(this.nation.activeUser.address)
	}

	@computed
	@placeholder()
	get reactionCount() {
		return 135232
		return this.reactions.count - 1
	}

	@computed
	@placeholder()
	get popularity() {
		return 0.34
		let total = Map(this.reactions.meta.toJS())
			.filter(r => r.value < 1)
			.reduce((tot, next) => tot + next.value, 0.0)
		return total / this.reactionCount
	}




// DATES

	@computed
	@placeholder(undefined)
	get timestamp() {
		return this.state.get("timestamp")
	}

	@computed
	@placeholder("")
	get age() {
		return this.nation.store.formatAge(this.timestamp)
	}

	@computed
	@placeholder("")
	get date() {
		return formatDate(this.timestamp)
	}

	@computed
	@placeholder("")
	get time() {
		return formatTime(this.timestamp)
	}

	@computed
	@placeholder("")
	get datetime() {
		return `${this.date}, ${this.time}`
	}




// REFERENCES

	@computed
	@placeholder({})
	get references() {
		return this.state.get("references")
	}

	@computed
	@placeholder([])
	get links() {
		let result = List()
		let links = Map(this.references.links)
		for (let i = 0; i < links.size; i++) {
			result = result.push(links.get(`${i}`))
		}
		return result.toJS()
	}

	contentFor(type, ref) {
		switch (type) {
			case "links": return ""
			case "mention": return this.nation.get("user", ref).label
			case "topic": return this.nation.get("topic", ref).label
			case "domain": return this.nation.get("domain", ref).label
			default: return ""
		}
	}

	@computed
	@placeholder([])
	get markup() {

		// Unpack text
		let regex = this.nation.store.config.regex.reference
		let textParts = this.text.split(regex)

		// Markup text
		let text = textParts.map(t => { return {
			type: "text",
			text: t
		}})

		// Return posts without references immediately
		if (text.length === 1) return text

		// Markup References
		let refs = this.text
			.match(regex)
			.map(r => r.substring(1, r.length - 1))
			.map(r => {

				// Get reference type and index
				let [ type, i ] = r.split(":")
				let ref = this.references[type][i]

				// Return markup
				return {
					type,
					text: this.contentFor(type, ref),
					target: ref,
				}

			})

		// Combine text with references
		return List(text)
			.interleave(List([
				...refs,
				{
					type: "text",
					text: ""
				}
			]))
			.toJS()

	}

	@computed
	@placeholder([])
	get media() {
		let addresses = this.state.get("media") || []
		return addresses.map(address => this.nation.get("Media", address))
	}




// THREAD

	@computed
	@placeholder(false)
	get isOrigin() {
		return this.originAddress === this.address
	}

	@computed
	@placeholder()
	get originAddress() {
		return this.state.get("origin")
	}

	@computed
	@placeholder()
	get parentAddress() {
		return this.state.get("parent")
	}

	@computed
	@placeholder()
	get originPost() {

		// Return undefined if this post is the thread origin
		if (this.originAddress === this.address) return

		// Otherwise, return the origin post
		return this.nation.get("Post", originAddress)

	}

	@computed
	@placeholder()
	get parentPost() {

		// Return undefined if this post has no parent
		if (!this.parentAddress) return

		// Otherwise, return the previous post in the thread
		return this.nation.get("Post", this.parentAddress)

	}

	@computed
	@placeholder(ReplyIndex)
	get replies() {
		return this.nation.get("Replies", this.attributes.get("Replies"))
	}


	@computed
	@placeholder()
	get replyCount() {
		return this.replies.count
	}

	@computed
	@placeholder()
	get quoteCount() {
		return 0
	}




// PROMOTIONS

	@computed
	@placeholder(PromotionIndex)
	get promotions() {
		return this.nation.get("Promotions", this.attributes.get("Promotions"))
	}

	@computed
	@placeholder()
	get promotionCount() {
		return this.promotions.count
	}

	@computed
	@placeholder()
	get promotionSpend() {
		return {
			pod: this.promotions
				.filter(p => p.currency === "POD")
				.reduce((tot, nxt) => tot + nxt.value, 0.0),
			aud: this.promotions
				.filter(p => p.currency === "AUD")
				.reduce((tot, nxt) => tot + nxt.value, 0.0),
		}
	}




// AUTHOR

	@computed
	@placeholder()
	get authorAddress() {
		return this.state.get("author")
	}

	@computed
	@placeholder(User)
	get author() {
		return this.nation.get("user", this.authorAddress)
	}




}

export default Post;