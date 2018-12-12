import React from 'react';
import RX from 'reactxp';
import {PicUrl} from '../Types';
import {Dimensions} from 'react-native';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

interface StatusMediaProps {
  picUrls: PicUrl[];
}

interface StatusMediaState {
  index: number;
  visible: boolean;
}

const {width} = Dimensions.get('window');

const _styles = {
  picWrap: RX.Styles.createViewStyle({
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  }),
  pictureItem: RX.Styles.createViewStyle({
    width: 40,
    height: 40
  }),
};

export default class StatusMedia extends RX.Component<StatusMediaProps, StatusMediaState> {

  state: StatusMediaState = {
    index: 0,
    visible: false
  };

  private _onImageView(index: number) {
    this.setState(() => ({
      index,
      visible: true
    }));
  }

  private _onImageViewClick() {
    this.setState(() => ({
      visible: false
    }));
  }

  private _onRequestClose() {
    
  }

  public render() {
    const {picUrls} = this.props;

    const images = picUrls.map((item, index, array) => {
      return {
        url: item.thumbnail_pic.replace(/\/thumbnail\//, '/large/')
      }
    })

    return (
      <RX.View style={ _styles.picWrap }>
        {
          picUrls.map((item, index, array) => {
            let w;
            const parentWidth = width - 90;
            const length = array.length;
      
            if (length > 5) {
              w = parentWidth / 3;
            } else if (length < 2) {
              w = parentWidth / 2;
            } else {
              w = parentWidth * 1.1 / 3;
            }
      
            const style = RX.Styles.createViewStyle({
              width: w,
              height: w
            }, false);
      
            return (
              <RX.View key={item.thumbnail_pic} style={style} onPress={this._onImageView.bind(this, index)}>
                <RX.Image style={ [_styles.pictureItem, style] }
                  source={item.thumbnail_pic.replace(/\/thumbnail\//, '/bmiddle/')} />
              </RX.View>
            )
          })
        }
        <Modal visible={this.state.visible} transparent={true} onRequestClose={this._onRequestClose}>
          <ImageViewer onClick={this._onImageViewClick.bind(this)}
            enableSwipeDown={true}
            imageUrls={images} index={this.state.index} />
        </Modal>
      </RX.View>
      
    );
  }

}