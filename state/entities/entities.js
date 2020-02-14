import Entity from './entity';

import User from './user';
import Profile from './profile';
import Alias from './alias';

import Post from './post';
import Domain from './domain';
import Token from './token';

import Media from './media';
import Picture from './picture';

import BiasIndex from './indexes/biasIndex';
import FollowerIndex from './indexes/followerIndex';
import FollowingIndex from './indexes/followingIndex';
import PostIndex from './indexes/postIndex';
import ReplyIndex from './indexes/replyIndex';
import TokenIndex from './indexes/tokenIndex';
import OwnableIndex from './indexes/ownableIndex';
import ReactionIndex from './indexes/reactionIndex';




function getEntity(type) {
	switch (type.toLowerCase()) {

		case "entity": return Entity

		case "user": return User
		case "profile": return Profile
		case "alias": return Alias
		
		case "post": return Post
		case "domain": return Domain
		case "token": return Token

		case "media": return Media
		case "picture": return Picture

		case "biasindex": return BiasIndex
		case "followers": return FollowerIndex
		case "following": return FollowingIndex
		case "postindex": return PostIndex
		case "replyindex": return ReplyIndex
		case "tokenindex": return TokenIndex
		case "ownableindex": return OwnableIndex
		case "reactionindex": return ReactionIndex

		default: 
			throw new Error(`Unknown Entity Type: ${type}`)

	}
}


export {
	Entity,
	User, Profile, Alias, Media, Post, Domain, Token,
	FollowerIndex, FollowingIndex, PostIndex, TokenIndex, OwnableIndex,
	getEntity
}