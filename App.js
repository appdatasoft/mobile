import React from 'react';
import BarcodeScan from './components/BarcodeScan'
import HomeScreen from './components/HomeScreen'
import Details from './components/Details'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';  

const Stack = createStackNavigator();  

export default class App extends React.Component {  
  render() {  
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} initialParams={{ data: 'initial' }} />
            <Stack.Screen name="Scan" component={BarcodeScan} />
            <Stack.Screen name="Details" component={Details} />
          </Stack.Navigator> 
        </NavigationContainer>
      );  
  }  
}  
