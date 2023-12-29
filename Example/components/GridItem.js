import React from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";

const GridItem = (props) => {
    return (
    <View style={[style.gridItem, { backgroundColor: props.color }]}>
        <Pressable
            style={style.button}
            android_ripple={{ color: '#ccc' }}
        >
            <View style={[style.innerContainer]}>
                <Text style={style.textStyling}>{props.title}</Text>
            </View>
        </Pressable>
    </View>
    )
}

export default GridItem;

const style = StyleSheet.create({
    textStyling: {
            fontSize: 20,
            fontStyle: 'italic',
            color: 'black'
    },
    innerContainer: {
            flex: 1,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center'

    },
    button: {
            flex: 1
    },
    gridItem: {
        flex: 1,
        margin: 5,
        height: 150,
        backgroundColor: 'white',
        borderRadius: 4,
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    }
})