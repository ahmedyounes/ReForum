import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';

import { postDiscussion } from './actions';
import RichEditor from 'Components/RichEditor';
import PinButton from 'Components/NewDiscussion/PinButton';
import TagsInput from 'Components/NewDiscussion/TagsInput';

import styles from './styles.css';
import appLayout from 'SharedStyles/appLayout.css';

class NewDiscussion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forumId: null,
      userId: null,
      title: null,
      content: null,
      tags: [],
      pinned: false,
    };
  }

  componentDidMount() {
    const {
      user,
      currentForum,
      forums,
    } = this.props;

    this.setUserAndForumID(user, forums, currentForum);
  }

  componentWillReceiveProps(nextProps) {
    const {
      user,
      currentForum,
      forums,
    } = nextProps;

    this.setUserAndForumID(user, forums, currentForum);
  }

  setUserAndForumID(user, forums, currentForum) {
    const currentForumId = _.find(forums, { forum_slug: currentForum })._id;
    this.setState({
      forumId: currentForumId,
      userId: user._id,
    });
  }

  renderEditor() {
    const { authenticated } = this.props.user;
    const { postDiscussion } = this.props;

    if (authenticated) {
      return [
        <input
          key={'title'}
          type="text"
          className={styles.titleInput}
          placeholder={'Discussion title...'}
          onChange={(event) => { this.setState({ title: event.target.value }); }}
        />,
        <PinButton
          key={'pinned'}
          onChange={(val) => { this.setState({ pinned: val }); }}
        />,
        <TagsInput
          key={'tags'}
        />,
        <RichEditor
          key={'content'}
          type='newDiscussion'
          onChange={(value) => { this.setState({ content: value }); }}
          onSave={() => { postDiscussion(this.state); }}
        />,
      ];
    }

    return (
      <div className={classnames(appLayout.constraintWidth, styles.signInMsg)}>
        Please sign in before posting a new discussion.
      </div>
    );
  }

  render() {
    const { currentForum } = this.props;

    return (
      <div className={classnames(appLayout.constraintWidth, styles.content)}>
        <div className={styles.forumInfo}>
          You are creating a new discussion on <span className={styles.forumName}>{currentForum}</span> forum.
        </div>

        { this.renderEditor() }
      </div>
    );
  }
}

export default connect(
  (state) => { return {
    user: state.user,
    forums: state.app.forums,
    currentForum: state.app.currentForum,
    newDiscussion: state.newDiscussion,
  }; },
  (dispatch) => { return {
    postDiscussion: (discussion) => { dispatch(postDiscussion(discussion)); },
  }; }
)(NewDiscussion);
