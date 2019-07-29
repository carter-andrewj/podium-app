import React from 'react';
import Component from '../utils/component';
import { Text, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../styles/styles';



@inject("store")
@observer
class Post extends Component {


	render() {

		let post = this.props.store.posts[this.props.address]
		let author = this.props.store.users[post.author]

		return <View style={[styles.container, styles.post.wrapper]}>

			<View style={styles.post.columns}>

				<View style={styles.post.columnLeft}>
					<Image
						style={styles.post.profilePicture}
						source={author.picture}
					/>
				</View>

				<View style={styles.post.columnMiddle}>
					<View style={styles.post.header}>
						<Text style={styles.post.authorName}>
							{author.name}
						</Text>
						<Text style={styles.post.authorOther}>
							{`${author.identity} | ${post.created}`}
						</Text>
					</View>
					<View style={styles.post.body}>
						{post.content}
					</View>
				</View>

				<View style={styles.post.columnRight}>
					
					<View style={styles.post.buttonHolder}>
						<Text style={styles.post.counter}>
							{post.promos.length}
						</Text>
						<Button style={styles.post.button}>
							<FontAwesomeIcon
								icon={"megaphone"}
								size={iconSize}
								color={config.colors.neutral}
								style={styles.post.buttonIcon}
							/>
						</Button>
					</View>

					<View style={styles.post.buttonHolder}>
						<Text style={styles.post.counter}>
							{post.replies.length}
						</Text>
						<Button style={styles.post.button}>
							<FontAwesomeIcon
								icon={"reply"}
								size={iconSize}
								color={config.colors.neutral}
								style={styles.post.buttonIcon}
							/>
						</Button>
					</View>

				</View>

			</View>

		</View>
	}

}