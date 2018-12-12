import React from 'react';
import RX from 'reactxp';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

const _styles = {
  modalContainer: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: '#fff',
    width
  }),
  modal: RX.Styles.createViewStyle({
    top: 100,
    paddingHorizontal: 20
  }),
  input: RX.Styles.createTextInputStyle({
    height: 200
  }),
  header: RX.Styles.createViewStyle({
    flexDirection: 'row',
    justifyContent: 'space-between'
  }),
  okButtonText: RX.Styles.createTextStyle({
    color: '#268bd2',
    fontSize: 20
  }),
};

class TweetDialog {
  _modalId = 'TweetDialog';

  private _onCancelButtonPress() {

  }

  private _onOkButtonPress = (e: RX.Types.SyntheticEvent) => {
    RX.Modal.dismiss(this._modalId);
  };

  showDialog() {
    const dialog = (
      <RX.View style={ _styles.modalContainer }>
        <RX.View style={ _styles.modal }>
          <RX.View style={_styles.header}>
            <RX.Button onPress={ this._onCancelButtonPress.bind(this) }>
              <Icon name="close" size={20} color="#999" />
            </RX.Button>
            <RX.Button onPress={ this._onOkButtonPress.bind(this) }>
              <RX.Text style={ _styles.okButtonText }>发送</RX.Text>
            </RX.Button>
          </RX.View>
          <RX.TextInput placeholder='有什么新鲜事？' multiline={true} style={ _styles.input }></RX.TextInput>
        </RX.View>
      </RX.View>
    );

    RX.Modal.show(dialog, this._modalId);
  }
  
}

export default new TweetDialog();