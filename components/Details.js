import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class Details extends Component {
constructor() {
    super();
    this.state = {
      isLoading: false,
      barcode: {},
      id: '',
    };
  }

  componentDidMount() {
    // this._subscribe = this.props.navigation.addListener('didFocus', () => {
      const { navigation, route } = this.props;
      db.barcodeById(route.params.id).then((data) => {
        console.log(data);
        barcode = data;
        this.setState({
          barcode,
          isLoading: false,
          id: barcode.id
        });
      }).catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false
        }
      })
    // });
  }

  deleteBarcode(id) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    db.deleteBarcode(id).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false
      }, () => {
        this.props.navigation.goBack();
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            <View>
              <Text style={{fontSize: 16}}>Barcode: {this.state.barcode.code}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Barcode Name: {this.state.barcode.name}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Barcode Price: {this.state.barcode.price}</Text>
            </View>
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#999999'}
              color={'#FFFFFF'}
              leftIcon={{name: 'delete'}}
              title='Delete'
              onPress={() => this.deleteBarcode(this.state.id)} />
          </View>
        </Card>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20
    },
    subContainer: {
      flex: 1,
      paddingBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: '#CCCCCC',
    },
    activity: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    detailButton: {
      marginTop: 10
    }
  })