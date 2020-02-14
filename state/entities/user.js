import { observable, computed } from 'mobx';

import { List } from 'immutable';

import Entity from './entity';
import Profile from './profile';
import Alias from './alias';
import FollowerIndex from './indexes/followerIndex';
import FollowingIndex from './indexes/followingIndex';
import PostIndex from './indexes/postIndex';

import { placeholder } from './utils';



class User extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "User"

		// Methods
		this.signOut = this.signOut.bind(this)

		this.isFollowing = this.isFollowing.bind(this)
		this.isFollower = this.isFollower.bind(this)

		this.follow = this.follow.bind(this)
		this.unfollow = this.unfollow.bind(this)

		this.post = this.post.bind(this)

	}




// ATTRIBUTES

	@computed
	@placeholder(Profile)
	get profile() {
		return this.nation.get("profile", this.attributes.get("Profile"))
	}

	@computed
	@placeholder(Alias)
	get aliasEntity() {
		return this.nation.get("alias", this.attributes.get("Alias"))
	}

	@computed
	@placeholder(FollowerIndex)
	get followers() {
		return this.nation.get("followers", this.attributes.get("Followers"))
	}

	@computed
	@placeholder(FollowingIndex)
	get following() {
		return this.nation.get("following", this.attributes.get("Following"))
	}

	@computed
	@placeholder(PostIndex)
	get posts() {
		return this.nation.get("posts", this.attributes.get("Posts"))
	}




// GETTERS

	@computed
	@placeholder("@...")
	get alias() {
		return this.aliasEntity.alias
	}

	get label() {
		return this.alias
	}

	@computed
	get placeholderName() {
		return this.alias.substring(1)
	}

	@computed
	get name() {
		return this.profile.name
	}

	@computed
	get role() {
		return this.state.get("role")
	}

	@computed
	@placeholder("")
	get about() {
		return this.profile.about
	}

	@computed
	get followerCount() {
		return this.followers.count
	}

	@computed
	get followingCount() {
		return this.following.count
	}

	@computed
	get postCount() {
		return this.posts.count
	}

	get integrity() {
		return 0.5
	}

	get affinity() {
		return 0.5
	}

	get sanctionCount() {
		return 0
	}

	@computed
	get transactions() {
		return {
			pod: this.wallet.get("POD"),
			aud: this.wallet.get("AUD"),
		}
	}

	@computed
	get pod() {
		return List(this.transactions.pod)
			.reduce((tot, txn) => tot + txn.value, 0)
	}

	@computed
	get aud() {
		return List(this.transactions.aud)
			.reduce((tot, txn) => tot + txn.value, 0)
	}




// UTILITIES

	isFollowing(user) {
		return this.following.has(user.address)
	}

	isFollower(user) {
		return this.followers.has(user.address)
	}




// ACTIONS

	signOut() {
		return this.act("signOut")
	}


	follow(user) {
		return this.act("Follow", `Following ${user.alias}...`, user)
	}


	unfollow(user) {
		return this.act("Unfollow", `Unfollowing ${user.alias}...`, user)
	}


	post(content) {
		return this.act("Compose", `Sending post...`, content, "POD")
	}


	react(post, value) {
		return this.act("React", `Reacting to ${post.author.alias}...`, post, value)
	}



}

export default User;