import React from 'react';
import { ComponentBase } from 'resub';
import TokenStore from './store/token';
import EmotionStore from './store/emotions';
import { createStackNavigator, createMaterialTopTabNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import SettingsScreen from './controller/settings';
import DetailsScreen from './controller/details';
import UserScreen from './controller/user';
import HomeScreen from './controller/home';
import MentionCommentsScreen from './controller/mentionsComments';
import MentionsStatusesScreen from './controller/mentionsStatuses';
import LoginScreen from './controller/login';
import TweetScreen from './controller/tweet';
import ProfileScreen from './controller/Profile';
import FriendsScreen from './controller/Friends';
import FollowersScreen from './controller/Followers';
import Icon from 'react-native-vector-icons/FontAwesome';

const MentionTopTab = createMaterialTopTabNavigator({
  Statuses: MentionsStatusesScreen,
  Comments: MentionCommentsScreen
}, {
  tabBarOptions: {
    style: {
      backgroundColor: '#999'
    },
  }
});

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  Settings: SettingsScreen,
}, {
  headerMode: 'none'
});

const HomeBottomTab = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Mentions: MentionTopTab,
    Profile: ProfileStack
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `home${focused ? '' : ''}`;
        } else if (routeName === 'Profile') {
          iconName = `user${focused ? '' : ''}`;
        } else if (routeName === 'Mentions') {
          iconName = `at${focused ? '' : ''}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);

const HomeStack = createStackNavigator({
  HomeBottomTab: HomeBottomTab,
  Followers: FollowersScreen,
  Friends: FriendsScreen,
  Details: DetailsScreen,
  User: UserScreen
});


const HomeTweetStack = createStackNavigator({
  HomeStack: HomeStack,
  Tweet: TweetScreen
},

{
  mode: 'modal',
  headerMode: 'none',
});


HomeTweetStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const RootAppContainer = createAppContainer(HomeTweetStack);

interface AppState {
  tokenChecked: boolean;
  hasToken: boolean;
}

export class App extends ComponentBase<{}, AppState> {

  protected _buildState(props: {}, initialBuild: boolean) {
    return {
      hasToken: TokenStore.hasToken(),
      tokenChecked: initialBuild ? false : this.state.tokenChecked,
    }
  }

  async componentDidMount() {

    await Promise.all([
      TokenStore.restore(),
      EmotionStore.restore()
    ]);

    if (TokenStore.hasToken() && !EmotionStore.hasLocalStore()) {
      await EmotionStore.fetch();
    }

    this.setState(() => {
      return {
        tokenChecked: true
      }
    })
  }

  public render() {
    if (!this.state.tokenChecked) {
      return null;
    }

    if (this.state.hasToken) {
      return <RootAppContainer />
    }

    return <LoginScreen />
  }
}