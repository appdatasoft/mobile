import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Database from '../Database';
import UUIDGenerator from 'react-native-uuid-generator';

const db = new Database();

export default class BarcodeScan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      code: '',
      name: '',
      price: '',
      isLoading: false,
      found: false
    }
  }
  // shouldComponentUpdate() {
  //   console.log('Greeting - shouldComponentUpdate lifecycle');

  //   return false;
  // }
  onBarCodeRead = (e) => {
    if (this.state.found == false) {
      this.setState({ found: true }, () => {
        UUIDGenerator.getRandomUUID().then((uuid) => {
          this.setState({ id: uuid, code: e.data, name: 'Book', price: '1000' }, () => {
            if (this.state.id != '') {
              console.log(this.state.id)
              this.saveBarcode();
            }
            else {
              console.log('empty')
            }
            console.log(this.state)
          });
        });
      });
    }
  }
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveBarcode() {
    this.setState({
      isLoading: true,
    });
    let data = {
      id: this.state.id,
      code: this.state.code,
      name: this.state.name,
      price: this.state.price,
    }
    db.addBarcode(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      }, () => {
        this.props.route.params.onNavigateBack;
        this.props.navigation.goBack();
      });
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          onBarCodeRead={this.onBarCodeRead}
          captureAudio={false}
          ref={cam => this.camera = cam}
        //   aspect={RNCamera.Constants.Aspect.fill}
        >
        </RNCamera>
        {/* <View style={styles.bottomOverlay}>
          <Button title="Go back" onPress={() => this.props.navigation.navigate('Home', { data: this.state.value })} />
        </View> */}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40
  },
  bottomOverlay: {
    position: "absolute",
    width: "100%",
    flex: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
});