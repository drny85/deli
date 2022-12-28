import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

import { TextStyle, TextProps } from 'react-native';
import { SIZES } from '../constants';

interface TextProp extends TextProps {
    small?: boolean;
    large?: boolean;
    title?: boolean;
    caption?: boolean;
    center?: boolean;
    left?: boolean;
    bold?: boolean;
    right?: boolean;
    darkText?: boolean;
    lightText?: boolean;
    capitalize?: boolean;
    uppercase?: boolean;
    raleway?: boolean;
    raleway_bold?: boolean;
    raleway_italic?: boolean;

    lowercase?: boolean;
    lobster?: boolean;
    py_4?: boolean;
    py_6?: boolean;
    py_8?: boolean;
    px_4?: boolean;
    px_6?: boolean;
    pb_4?: boolean;
    pb_6?: boolean;
    medium?: boolean;
    tange?: boolean;
    xlarge?: boolean;
    containerStyle?: TextStyle;
}

const Text = styled(Animatable.Text)<TextProp>`
    color: ${({ theme }) => (theme.mode === 'dark' ? 'white' : 'black')};
    font-family: ${({
        tange,
        lobster,
        raleway,
        raleway_bold,
        raleway_italic
    }) =>
        tange
            ? 'tange'
            : lobster
            ? 'lobster'
            : raleway
            ? 'raleway'
            : raleway_bold
            ? 'raleway-bold'
            : raleway_italic
            ? 'raleway-italic'
            : 'montserrat'};

    ${({ small, medium, large, xlarge }: any) => {
        switch (true) {
            case small:
                return `font-size: ${SIZES.isSmallDevice ? '10px' : '14px'}`;
            case large:
                return `font-size: 24px`;
            case medium:
                return `font-size: 18px`;
            case xlarge:
                return `font-size: 40px`;

            default:
                return `font-size: ${SIZES.isSmallDevice ? '14px' : '16px'}`;
        }
    }};
    ${({ title, caption }: any) => {
        switch (true) {
            case title:
                return `font-family: montserrat-bold; font-size:22px`;
            case caption:
                return `font-family: italic;`;
            default:
                return `font-weight: 500`;
        }
    }};
    ${({ left, center, right }: any) => {
        switch (true) {
            case left:
                return `text-align: left`;
            case center:
                return `text-align: center`;
            case right:
                return `text-align: right`;
        }
    }};
    ${({ capitalize, uppercase, lowercase }: any) => {
        switch (true) {
            case capitalize:
                return `text-transform: capitalize`;
            case uppercase:
                return `text-transform: uppercase`;
            case lowercase:
                return `text-transform: lowercase`;
        }
    }};
    ${({ bold }: any) => {
        switch (true) {
            case bold:
                return `font-family: montserrat-bold; font-size:16px;`;
        }
    }};

    ${({ py_4, py_6, py_8 }: any) => {
        switch (true) {
            case py_4:
                return `padding: 8px 0px`;

            case py_6:
                return `padding: 12px 0px`;
            case py_8:
                return `padding: 18px 0px`;
        }
    }};
    ${({ px_4, px_6 }: any) => {
        switch (true) {
            case px_4:
                return `padding: 6px 8px`;

            case px_6:
                return `padding: 6px 12px`;
        }
    }};
    ${({ pb_4, pb_6 }: any) => {
        switch (true) {
            case pb_4:
                return `padding-bottom: 8px`;

            case pb_6:
                return `padding-bottom: 12px`;
        }
    }};

    ${({ darkText, lightText }: any) => {
        switch (true) {
            case darkText:
                return `color: black`;

            case lightText:
                return `color:white`;
        }
    }}
`;

export default Text;
