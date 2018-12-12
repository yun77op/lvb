import React from 'react';
import RX from 'reactxp';
import EmotionStore from '../store/emotions';

const _styles = {
  link: RX.Styles.createTextStyle({
    color: '#268bd2'
  }),
  icon: RX.Styles.createImageStyle({
    width: 14,
    height: 14
  }),
}
export const filterStatus = (text: string) => {
  const parts = text.split(/(\[[^\]]+\]|https?:\/\/[^\s]+)/);

  return (
    <RX.Text>
      {
        parts.map((part, index) => {

          if (part === '') {
            return null;
          } else if (part[0] === '[') {
            const url = EmotionStore.getEmotionUrlByValue(part);
            if (url) {
              return <RX.Image style={_styles.icon} key={index} source={url} />
            } else {
              return null
            }
          } else if (/https?:\/\//.test(part)) {
            return <RX.Link style={_styles.link} key={index} url={part}>{part.replace(/https?:\/\//, '')}</RX.Link>
          }

          return <RX.Text key={index}>{part}</RX.Text>
        })
      }
    </RX.Text>
  )
}