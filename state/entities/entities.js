import Entity from './entity';

import User from './user';
import Profile from './profile';
import Alias from './alias';
import Media from './media';
import Post from './post';
import Domain from './domain';
import Token from './token';

import FollowerIndex from './indexes/followerIndex';
import FollowingIndex from './indexes/followingIndex';
import PostIndex from './indexes/postIndex';
import TokenIndex from './indexes/tokenIndex';
import OwnableIndex from './indexes/ownableIndex';




function getEntity(type) {
	switch (type.toLowerCase()) {

		case "entity": return Entity

		case "user": return User
		case "profile": return Profile
		case "alias": return Alias
		case "media": return Media
		case "post": return Post
		case "domain": return Domain
		case "token": return Token

		case "followers": return FollowerIndex
		case "following": return FollowingIndex
		case "posts": return PostIndex
		case "tokens": return TokenIndex
		case "owned": return OwnableIndex

		default: throw new Error(`Unknown Entity Type: ${type}`)

	}
}


export {
	Entity,
	User, Profile, Alias, Media, Post, Domain, Token,
	FollowerIndex, FollowingIndex, PostIndex, TokenIndex, OwnableIndex,
	getEntity
}