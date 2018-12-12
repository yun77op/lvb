import React from 'react';
import RX from 'reactxp';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import EmotionStore from '../store/emotions';
import CommentsStore from '../store/comments';
import StatusStore from '../store/status';
import { TouchableOpacity, Dimensions, StyleSheet, Alert, SafeAreaView } from 'react-native';


const _stylesNative = StyleSheet.create({
  containerStyle: {
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  modal: {
    flex: 1,
  }
});
const width = Dimensions.get('window').width;

const _styles = {
  modalContainer: RX.Styles.createViewStyle({
    flex: 1,
    paddingHorizontal: 20
  }),
  input: RX.Styles.createTextInputStyle({
    height: 200
  }),
  header: RX.Styles.createViewStyle({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  }),
  okButtonText: RX.Styles.createTextStyle({
    color: '#268bd2',
    fontSize: 20
  }),
  footer: RX.Styles.createViewStyle({
    position: 'absolute',
    left: 20,
    bottom: 20,
    width: width - 40
  }),
  actions: RX.Styles.createViewStyle({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  faceContainer:RX.Styles.createViewStyle({
    height: 200,
  }),
  faces: RX.Styles.createViewStyle({
    flexDirection: 'row',
    flexWrap: 'wrap'
  }),
  emotion: RX.Styles.createImageStyle({
    width: 30,
    height: 30,
    margin: 5
  }),
};

export default class TweetScreen extends RX.Component {

  state = {
    checked: false,
    value: '',
    facesVisible: false,
    emotions: EmotionStore.getEmotions()
  }

  static getDerivedStateFromProps(props, state) {
    const { navigation } = props;
    const comment = navigation.getParam('comment') || '';
    const type = navigation.getParam('type');
    const id = navigation.getParam('id');

    return {
      value: state.value ? state.value : comment,
      type,
      statusId: id
    }
  }

  private _onCancelButtonPress() {
    this.props.navigation.goBack();
  }

  private async _onOkButtonPress() {
    const { navigation } = this.props;

    const query = {
      comment_ori: this.state.checked ? '1' : '0',
      comment: this.state.value,
      id: this.state.statusId
    }

    let response;

    if (this.state.type === 'Comment') {
      response = await CommentsStore.addComment(query);
    } else if (this.state.type === 'Reply') {
      const cid = navigation.getParam('cid');
      query.cid = cid;

      response = await CommentsStore.addReply(query);
    }

    if (response.error) {
      Alert.alert(
        '错误',
        response.error
      )

      return;
    } else {
      Alert.alert(
        '成功',
        this.state.type === 'Comment' ? '评论成功' : '回复成功'
      )
    }

    navigation.goBack();
  };

  public render() {
    const { navigation } = this.props;
    const type = navigation.getParam('type');
    const status = StatusStore.getStatusById(this.state.statusId);
    const isShowCommentOri = (type === 'Comment' || type === 'Reply') && 
                              status && status.retweeted_status;

    return (
      <SafeAreaView style={ _stylesNative.modal }>
        <RX.View style={_styles.modalContainer}>
        <RX.View style={_styles.header}>
          <RX.Button onPress={ this._onCancelButtonPress.bind(this) }>
            <Icon name="close" size={20} color="#999" />
          </RX.Button>
          <RX.Button onPress={ this._onOkButtonPress.bind(this) }>
            <RX.Text style={ _styles.okButtonText }>发送</RX.Text>
          </RX.Button>
        </RX.View>
        <RX.TextInput 
          value={this.state.value}
          onChangeText={this._onChangeText.bind(this)}
          placeholder='有什么新鲜事？' multiline={true} style={ _styles.input }></RX.TextInput>
        <RX.View style={_styles.footer}>
          <RX.View style={_styles.actions}>
            {isShowCommentOri ? <CheckBox
              containerStyle={_stylesNative.containerStyle}
              title="评论给原微博"
              checked={this.state.checked}
              onPress={this._onCheckboxPress.bind(this)}
            /> : <RX.View></RX.View>}
            <Icon name="smile-o" size={30} color="#999" onPress={this._onFaceIconClick.bind(this)} />

          </RX.View>
          {this.state.facesVisible && <RX.ScrollView style={_styles.faceContainer}>
            <RX.View style={_styles.faces}>
            {
              this.state.emotions.map((emotion) => {
                const key = emotion.category + emotion.url;
                return (<TouchableOpacity key={key} onPress={this._onEmotionPress.bind(this, emotion.value)}>
                    <RX.Image source={emotion.url} style={_styles.emotion} />
                  </TouchableOpacity>)
              })
            }
            </RX.View>
          </RX.ScrollView>}
        </RX.View>
        </RX.View>
      </SafeAreaView>
    );
  }

  private _onChangeText(text) {
    this.setState(() => {
      return {
        value: text
      }
    });
  }

  private _onEmotionPress(emotion) {
    this.setState((state) => {
      return {
        value: state.value + emotion
      }
    })
  }

  private _onCheckboxPress() {
    this.setState({checked: !this.state.checked});
  }

  private _onFaceIconClick() {
    this.setState({facesVisible: !this.state.facesVisible});
  }
}