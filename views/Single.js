import React from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Left,
  Icon,
  Title,
  Text,
  Content,
  Container,
} from 'native-base';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

/*
Ulkoasu vaatii työtä
*/

const Single = ({route}) => {
  const {file} = route.params;
  console.log('kuva', mediaUrl + file.filename);
  return (
    <Container>
      <Content padder>
        <Card>
          <CardItem>
            <Left>
              <Icon name={'image'} />
              <Title>{file.title}</Title>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Image source={{uri: mediaUrl + file.filename}}
              style={{height: 400, width: null, flex: 1}}
            />
          </CardItem>
          <CardItem>
            <Text>
              {file.description}
            </Text>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};


Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
