import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import GithubScreen from '../screens/GithubScreen';

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  }
);

HomeStack.navigationOptions = {
  tabBarVisible: false,
  tabBarLabel: 'Logout',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-log-out' : 'md-logout'}
    />
  ),
};

const ChatStack = createStackNavigator(
  {
    Chat: ChatScreen,
  }
);

ChatStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'} />
  ),
};

const GithubStack = createStackNavigator(
  {
    Github: GithubScreen,
  }
);

GithubStack.navigationOptions = {
  tabBarLabel: 'Activity',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-git-branch' : 'md-git-branch'} />
  ),
};

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  ChatStack,
  GithubStack
});

tabNavigator.path = '';

export default tabNavigator;
