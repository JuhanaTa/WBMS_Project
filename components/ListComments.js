import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Body,
  Icon,
  Text,

} from 'native-base';
// url to api


const ListItem = ({singleComment}) => {
  console.log('singleComment: ', singleComment.comment);
  return (
    <Card >
      <CardItem>
        <View>
          <Text>{singleComment.comment}</Text>
        </View>
      </CardItem>
      <CardItem>

        <Body style={styles.body2}>

          <Text>{singleComment.time_added}</Text>

        </Body>
      </CardItem>
    </Card>


  );
};

/* <Button style={styles.buttons} onPress={
            () => {
              const data = {
                file: singleMedia,
                // distance: distance,
              };
              navigation.push('Single', {file: data});
            }}>
            <Icon style={styles.icon} name={'eye'}></Icon>
          </Button>*/

/* <Button style={styles.locationBtn} >
            <Icon transparent style={[styles.icon]} name={'compass'}></Icon>
            {singleMedia.distance > 0.1 ? (
          <Text style={styles.Text}>{Math.round(singleMedia.distance)}km</Text>
            ) : (
                <Text style={styles.Text}>here</Text>
              )
            }
          </Button> */


const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  body2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    color: '#FF421D',
    fontSize: 30,
  },
  like: {
    color: '#FF421D',
    fontSize: 30,
  },
  list: {
    marginBottom: 5,
    marginTop: 0,
  },
  Text: {
  },

});

ListItem.propTypes = {
  item: PropTypes.object,
  singleComment: PropTypes.object,
};


export default ListItem;
