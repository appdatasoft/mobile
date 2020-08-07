import React, { Component } from 'react';
import { Text, View, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
// import { useFocusEffect } from '@react-navigation/native';
import Database from '../Database';
// import { withNavigationFocus } from "react-navigation";

const db = new Database();


export default class HomeScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            barcodes: [],
            notFound: 'No barcodes present in database'
        };
        // this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }
    componentDidMount() {
        // const isFocused = this.props.navigation.isFocused();
        // if(isFocused) {
        //     Alert.alert('yes');
        //     this.getBarcodes();
        // }
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.getBarcodes();
        });

        
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.isFocused !== this.props.isFocused) {
    //         Alert.alert('yes')
    //         // Use the `this.props.isFocused` boolean
    //         // Call any action
    //     }
    // }
    getBarcodes() {
        let barcodes = [];
        db.listBarcode().then((data) => {
            barcodes = data;
            this.setState({
                barcodes,
                isLoading: false,
            });
        }).catch((err) => {
            console.log(err);
            this.setState = {
                isLoading: false
            }
        })
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            title={item.code}
            onPress={() => {
                this.props.navigation.navigate('Details', {
                    id: `${item.id}`,
                });
            }}
            chevron
            // rightIcon={{ name: 'delete', style: { marginRight: 0, fontSize: 48 }, onPress: () => this.deleteBarcode(item.id) }}
            bottomDivider
        />
    )

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        if (this.state.barcodes.length === 0) {
            return (
                <View>
                    <Text style={styles.message}>{this.state.notFound}</Text>
                    <Button
                        title="Scan Barcode"
                        onPress={() => {
                            this.props.navigation.navigate('Scan', {
                                onNavigateBack: this.handleOnNavigateBack
                            });
                        }}
                    />
                </View>
            )
        }
        return (
            <View>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.barcodes}
                    renderItem={this.renderItem}
                />
                <Button
                    title="Scan Barcode"
                    onPress={() => {
                        this.props.navigation.navigate('Scan', {
                            onNavigateBack: this.handleOnNavigateBack
                        });
                    }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
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
    message: {
        padding: 16,
        fontSize: 18,
        color: 'red'
    }
});

// export default withNavigationFocus(HomeScreen);