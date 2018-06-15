import React from "react";
import { Picker } from 'emoji-mart'
import ReactEmoji from 'react-emoji';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'emoji-mart/css/emoji-mart.css'
import './emoji-picker.css'

export default class EmojiPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pickerStyle: 'emojiPanelHidden' };
    }

    showHide() {
        if ('emojiPanelHidden' === this.state.pickerStyle)
            this.setState({ ...this.state, pickerStyle: 'emojiPanel' });
        else
            this.setState({ ...this.state, pickerStyle: 'emojiPanelHidden' });

    }

    buttonClicked() {
        this.showHide();
    }

    addEmoji(emoji){
        this.showHide();
        if (this.props.emojiFunc) {
            this.props.emojiFunc(emoji.colons);
        }
    }

    render() {
        const popoverHoverFocus = (
            <Popover id="popover-trigger-click-root-close" className={"emojiPopover"}>
                <Picker
                    onSelect={( emoji ) => { this.addEmoji( emoji ); }}
                    emojiTooltip={true}
                    sheetSize={32}
                    title={''}
                />
            </Popover>
        );
        return (
            <OverlayTrigger
                trigger={['click']}
                rootClose
                placement='bottom'
                overlay={popoverHoverFocus}
            >
                <div className='emojiButton' onClick={() => { this.buttonClicked(); }}>
                    {ReactEmoji.emojify(':)')}
                </div>
            </OverlayTrigger>
        );
    }

}
