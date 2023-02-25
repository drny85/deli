// styled-components.ts
import * as styledComponents from 'styled-components/native';

import { Theme } from './types';

const StyComp = styledComponents as unknown;

const {
    default: styled,
    css,
    ThemeProvider
} = StyComp as styledComponents.ReactNativeThemedStyledComponentsModule<Theme>;

export { css, ThemeProvider };
export default styled;
