/* @flow strict-local */
import React, { PureComponent } from 'react';

import type { NavigationScreenProp } from 'react-navigation';
import type { Dispatch, UserOrBot } from '../types';
import { createStyleSheet } from '../styles';
import { connect } from '../react-redux';
import { Screen, ZulipButton, Label } from '../common';
import { IconPrivateChat } from '../common/Icons';
import { privateNarrow } from '../utils/narrow';
import AccountDetails from './AccountDetails';
import { doNarrow } from '../actions';
import { getUserIsActive, getUserForId } from '../users/userSelectors';

const styles = createStyleSheet({
  pmButton: {
    marginHorizontal: 16,
  },
  deactivatedText: {
    textAlign: 'center',
    paddingBottom: 20,
    fontStyle: 'italic',
    fontSize: 18,
  },
});

type SelectorProps = $ReadOnly<{|
  isActive: boolean,
  user: UserOrBot,
|}>;

type Props = $ReadOnly<{|
  navigation: NavigationScreenProp<{ params: {| userId: number |} }>,

  dispatch: Dispatch,
  ...SelectorProps,
|}>;

class AccountDetailsScreen extends PureComponent<Props> {
  handleChatPress = () => {
    const { user, dispatch } = this.props;
    dispatch(doNarrow(privateNarrow(user.email)));
  };

  render() {
    const { user, isActive } = this.props;
    const title = {
      text: '{_}',
      values: {
        // This causes the name not to get translated.
        _: user.full_name || ' ',
      },
    };

    return (
      <Screen title={title}>
        <AccountDetails user={user} />
        {!isActive && (
          <Label style={styles.deactivatedText} text="(This user has been deactivated)" />
        )}
        <ZulipButton
          style={styles.pmButton}
          text={isActive ? 'Send private message' : 'View private messages'}
          onPress={this.handleChatPress}
          Icon={IconPrivateChat}
        />
      </Screen>
    );
  }
}

export default connect<SelectorProps, _, _>((state, props) => ({
  user: getUserForId(state, props.navigation.state.params.userId),
  isActive: getUserIsActive(state, props.navigation.state.params.userId),
}))(AccountDetailsScreen);
