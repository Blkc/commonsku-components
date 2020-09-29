import { map, pick, keys, isUndefined, get } from 'lodash';
import styled, { css } from 'styled-components';
import { parseMeasurement, sizes, media } from '../utils';
import { SizerTypes } from './Sizer'

export type SharedStyleTypes = {
  [key: string]: any,
  pr?: boolean | string | number,
  pl?: boolean | string | number,
  pt?: boolean | string | number,
  pb?: boolean | string | number,
  px?: boolean | string | number,
  py?: boolean | string | number,
  mr?: boolean | string | number,
  ml?: boolean | string | number,
  mt?: boolean | string | number,
  mb?: boolean | string | number,
  mx?: boolean | string | number,
  my?: boolean | string | number,
  hidden?: boolean,
  hide?: boolean,
  show?: boolean,
  block?: boolean,
  inlineBlock?: boolean,
  flex?: boolean,
  inline_flex?: boolean,
  grid?: boolean,
  custom?: string,
  bg?: string,
  float?: string,
  sizer?: SizerTypes,
  row?: {justify: string, wrap: string, align: string, padded: boolean, start: boolean, end: boolean},
  col?: {padded: boolean, start: boolean, end: boolean},
}

export const SharedStyles = css<SharedStyleTypes>`
  box-sizing: border-box;
  ${p => map(pick(p, keys(SHARED_STYLE_MAPS)), (v, k) => {
    return isUndefined(v) ? '' : SHARED_STYLE_MAPS[k](v);
  }).join('')}
`;

export const SHARED_STYLE_MAPS: { [key: string]: Function } = {
  // Padding
  padded: (val?: string | number) => `padding: ${parseMeasurement(val || 5)};`,
  p: (val?: string | number) => val && `padding: ${parseMeasurement(val)};`,
  padding: (val?: string | number) => val && `padding: ${parseMeasurement(val)};`,
  pr: (val?: string | number) => val && `padding-right: ${parseMeasurement(val)};`,
  pl: (val?: string | number) => val && `padding-left: ${parseMeasurement(val)};`,
  pt: (val?: string | number) => val && `padding-top: ${parseMeasurement(val)};`,
  pb: (val?: string | number) => val && `padding-bottom: ${parseMeasurement(val)};`,
  px: (val?: string | number) => val && `
    padding-left: ${parseMeasurement(val)};
    padding-right: ${parseMeasurement(val)};
  `,
  py: (val?: string | number) => val && `
    padding-top: ${parseMeasurement(val)};
    padding-bottom: ${parseMeasurement(val)};
  `,
  // Margin
  m: (val?: string | number) => val && `margin: ${parseMeasurement(val)};`,
  margin: (val?: string | number) => val && `margin: ${parseMeasurement(val)};`,
  mr: (val?: string | number) => val && `margin-right: ${parseMeasurement(val)};`,
  ml: (val?: string | number) => val && `margin-left: ${parseMeasurement(val)};`,
  mt: (val?: string | number) => val && `margin-top: ${parseMeasurement(val)};`,
  mb: (val?: string | number) => val && `margin-bottom: ${parseMeasurement(val)};`,
  mx: (val?: string | number) => val && `
    margin-left: ${parseMeasurement(val)};
    margin-right: ${parseMeasurement(val)};
  `,
  my: (val?: string | number) => val && `
    margin-top: ${parseMeasurement(val)};
    margin-bottom: ${parseMeasurement(val)};
  `,
  // Background
  bg: (val: string) => `background: ${val};`,
  // Display
  hidden: () => `visibility: hidden;`,
  hide: () => `visibility: hidden;`,
  show: (val: boolean) => val === true ? "visibility: visible;" : val === false ? "visibility: hidden;" : "",
  block: () => `display: block;`,
  inlineBlock: () => `display: inline-block;`,
  'inline-block': () => `display: inline-block;`,
  inline: () => `display: inline;`,
  flex: () => `display: flex;`,
  'inline-flex': () => `display: inline-flex;`,
  inline_flex: () => `display: inline-flex;`,
  grid: () => `display: grid;`,
  // Float
  float: (val: string) => `${val === 'clearfix' ? `
    &::after {
        content: "";
        display: table;
        clear: both;
    }` : `float: ${val}`};`, // left, right, none, clearfix
  // Position
  pos: (val: string) => `position: ${val}`,
  position: (val: string) => `position: ${val}`,
  // Overflow
  overflow: (val: string) => `overflow: ${val}`,
  // z-index
  z: (val: string | number) => `z-index: ${val}`,
  // Custom Styles
  sizer: (val: SizerTypes) => {
    let result = "";
    sizes.forEach(s => {
      if (val[s]) {
        if (["number", "boolean"].includes(typeof val[s])) {
          if (val[s] === false) {
            result += media[s](`visibility: hidden;`);
          } else {
            const w = typeof(val[s]) === 'boolean' ? 12 : val[s];
            //@ts-ignore
            result += media[s](`visibility: visible; max-width: ${w/12 * 100}%; flex-basis: ${w/12 * 100}%;`);
          }
        } else {
          result += media[s](val[s]);
        }
      }

      if (val[`${s}Offset`]) {
        //@ts-ignore
        result += media[s](`margin-left: ${(val[`${s}Offset`]/12 * 100)}%;`);
      }
      if (val[`${s}OffsetRight`]) {
        //@ts-ignore
        result += media[s](`margin-right: ${(val[`${s}OffsetRight`]/12 * 100)}%;`);
      }
      if (val[`${s}Style`]) {
        result += media[s](val[`${s}Style`]);
      }
    });
    return result;
  },
  row: (val: {justify: string, wrap: string, align: string, padded: boolean, start: boolean, end: boolean}) => {
    let result = `
      display: flex;
      box-sizing: border-box;
      flex-direction: row;
      flex: 0 1 auto;
      justify-content: ${get(val, 'justify', 'left')};
      flex-wrap: ${get(val, 'wrap', 'wrap')};
      align-items: ${get(val, 'align', 'stretch')};
    `;
    if (val.padded) { result += "padding: 0.5rem;"; }
    if (val.start) { result += "place-content: flex-start;"; }
    if (val.end) { result += "place-content: flex-end;";}
    return result;
  },
  col: (val: {padded: boolean, start: boolean, end: boolean}) => {
    let result = `
      flex: 12;
      flex-grow: 1;
      box-sizing: border-box;
    `;
    if (val.padded) { result += "padding: 0.5rem;"; }
    if (val.start) { result += "place-content: flex-start;"; }
    if (val.end) { result += "place-content: flex-end;"; }
    return result;
  },
  custom: (val?: string) => `${val}`,
};

export const Wrapper = styled.div`${SharedStyles}`;
export const Csku = styled.div`${SharedStyles}`;
